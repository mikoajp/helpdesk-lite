<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class TicketValidationTest extends TestCase
{
    public function test_ticket_creation_validation_rules()
    {
        // Valid data
        $validData = [
            'title' => 'Valid Title',
            'description' => 'Valid description',
            'priority' => 'high',
            'assignee_id' => null,
            'tags' => ['bug', 'urgent'],
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'assignee_id' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];

        $validator = Validator::make($validData, $rules);
        $this->assertFalse($validator->fails());
    }

    public function test_ticket_validation_fails_with_missing_title()
    {
        $data = [
            'description' => 'Valid description',
            'priority' => 'high',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    public function test_ticket_validation_fails_with_missing_description()
    {
        $data = [
            'title' => 'Valid Title',
            'priority' => 'high',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
    }

    public function test_ticket_validation_fails_with_invalid_priority()
    {
        $data = [
            'title' => 'Valid Title',
            'description' => 'Valid description',
            'priority' => 'invalid_priority',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('priority', $validator->errors()->toArray());
    }

    public function test_ticket_validation_accepts_valid_priorities()
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ];

        foreach (['low', 'medium', 'high'] as $priority) {
            $data = [
                'title' => 'Valid Title',
                'description' => 'Valid description',
                'priority' => $priority,
            ];

            $validator = Validator::make($data, $rules);
            $this->assertFalse($validator->fails(), "Priority '{$priority}' should be valid");
        }
    }

    public function test_ticket_update_validation_with_status()
    {
        $rules = [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
        ];

        foreach (['open', 'in_progress', 'resolved', 'closed'] as $status) {
            $data = ['status' => $status];
            $validator = Validator::make($data, $rules);
            $this->assertFalse($validator->fails(), "Status '{$status}' should be valid");
        }
    }

    public function test_ticket_validation_fails_with_invalid_status()
    {
        $data = ['status' => 'invalid_status'];

        $rules = [
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('status', $validator->errors()->toArray());
    }

    public function test_ticket_validation_accepts_tags_array()
    {
        $data = [
            'title' => 'Valid Title',
            'description' => 'Valid description',
            'priority' => 'high',
            'tags' => ['bug', 'urgent', 'frontend'],
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertFalse($validator->fails());
    }

    public function test_ticket_validation_fails_with_too_long_tag()
    {
        $longTag = str_repeat('a', 51); // 51 characters
        
        $data = [
            'title' => 'Valid Title',
            'description' => 'Valid description',
            'priority' => 'high',
            'tags' => [$longTag],
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('tags.0', $validator->errors()->toArray());
    }

    public function test_ticket_validation_fails_with_too_long_title()
    {
        $longTitle = str_repeat('a', 256); // 256 characters
        
        $data = [
            'title' => $longTitle,
            'description' => 'Valid description',
            'priority' => 'high',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    public function test_ticket_validation_accepts_null_assignee()
    {
        $data = [
            'title' => 'Valid Title',
            'description' => 'Valid description',
            'priority' => 'high',
            'assignee_id' => null,
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'assignee_id' => 'nullable|exists:users,id',
        ];

        $validator = Validator::make($data, $rules);
        $this->assertFalse($validator->fails());
    }
}
