<?php

namespace App\Services;

use App\Contracts\TriageServiceInterface;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\DTOs\TriageSuggestion;
use App\Models\Ticket;
use Illuminate\Support\Facades\Log;

class TriageService implements TriageServiceInterface
{
    /**
     * Generate triage suggestions for a ticket using deterministic rules
     * (with optional LLM integration behind feature flag)
     *
     * @param Ticket $ticket
     * @return array
     */
    public function suggestTriage(Ticket $ticket): TriageSuggestion
    {
        // Check if LLM integration is enabled
        $useLLM = config('services.llm.enabled', false);

        if ($useLLM) {
            return $this->suggestWithLLM($ticket);
        }

        return $this->suggestWithRules($ticket);
    }

    /**
     * Deterministic rule-based triage suggestion
     *
     * @param Ticket $ticket
     * @return array
     */
    private function suggestWithRules(Ticket $ticket): TriageSuggestion
    {
        $suggestedPriority = $this->determinePriority($ticket);
        $suggestedStatus = $this->determineStatus($ticket);
        $summary = $this->generateSummary($ticket, $suggestedPriority, $suggestedStatus);
        $confidence = $this->calculateConfidence($ticket, $suggestedPriority, $suggestedStatus);

        Log::info('Triage suggestion generated (rules)', [
            'ticket_id' => $ticket->id,
            'suggested_priority' => $suggestedPriority,
            'suggested_status' => $suggestedStatus,
            'confidence' => $confidence,
        ]);

        return new TriageSuggestion(
            ticketId: $ticket->id,
            suggestedPriority: $suggestedPriority,
            suggestedStatus: $suggestedStatus,
            summary: $summary,
            confidence: $confidence,
            method: 'rules',
        );
    }

    /**
     * LLM-based triage suggestion (mock/real behind feature flag)
     *
     * @param Ticket $ticket
     * @return array
     */
    private function suggestWithLLM(Ticket $ticket): TriageSuggestion
    {
        // This is a mock LLM response
        // In production, this would call an actual LLM API (OpenAI, Claude, etc.)
        
        try {
            $timeout = config('services.llm.timeout', 5);
            
            // Simulate LLM processing time
            usleep(100000); // 0.1 seconds

            // Mock LLM analysis
            $analysis = $this->mockLLMAnalysis($ticket);

            Log::info('Triage suggestion generated (LLM)', [
                'ticket_id' => $ticket->id,
                'suggested_priority' => $analysis['suggested_priority'],
                'suggested_status' => $analysis['suggested_status'],
            ]);

            return $analysis;

        } catch (\Exception $e) {
            throw new \App\Exceptions\TriageFailedException('LLM service unavailable', [
                'ticket_id' => $ticket->id,
                'error' => $e->getMessage(),
            ], 0, $e);
        }
    }

    /**
     * Mock LLM analysis (simulates LLM response)
     *
     * @param Ticket $ticket
     * @return array
     */
    private function mockLLMAnalysis(Ticket $ticket): TriageSuggestion
    {
        // Use rule-based logic as base, but enhance with "LLM-like" reasoning
        $priority = $this->determinePriority($ticket);
        $status = $this->determineStatus($ticket);
        
        // Generate more sophisticated summary for LLM mode
        $summary = $this->generateLLMSummary($ticket, $priority, $status);
        
        return new TriageSuggestion(
            ticketId: $ticket->id,
            suggestedPriority: $priority,
            suggestedStatus: $status,
            summary: $summary,
            confidence: 0.85,
            method: 'llm',
            reasoning: $this->generateReasoning($ticket, $priority, $status),
        );
    }

    /**
     * Determine suggested priority based on ticket content
     *
     * @param Ticket $ticket
     * @return string
     */
    private function determinePriority(Ticket $ticket): string
    {
        $title = strtolower($ticket->title);
        $description = strtolower($ticket->description);
        $tags = is_array($ticket->tags) ? array_map('strtolower', $ticket->tags) : [];
        $content = $title . ' ' . $description;

        // High priority keywords
        $highPriorityKeywords = config('triage.keywords.high_priority', []);

        // Low priority keywords
        $lowPriorityKeywords = config('triage.keywords.low_priority', []);

        // Check tags first
        if (in_array('urgent', $tags) || in_array('critical', $tags)) {
            return TicketPriority::HIGH->value;
        }

        if (in_array('enhancement', $tags) || in_array('feature', $tags)) {
            return TicketPriority::LOW->value;
        }

        // Check content for keywords
        foreach ($highPriorityKeywords as $keyword) {
            if (str_contains($content, $keyword)) {
                return TicketPriority::HIGH->value;
            }
        }

        foreach ($lowPriorityKeywords as $keyword) {
            if (str_contains($content, $keyword)) {
                return TicketPriority::LOW->value;
            }
        }

        // Default to medium if current priority is not set
        return $ticket->priority?->value ?? TicketPriority::MEDIUM->value;
    }

    /**
     * Determine suggested status based on ticket state
     *
     * @param Ticket $ticket
     * @return string
     */
    private function determineStatus(Ticket $ticket): string
    {
        // If ticket has assignee and is open, suggest in_progress
        if ($ticket->assignee_id && $ticket->status === TicketStatus::OPEN) {
            return TicketStatus::IN_PROGRESS->value;
        }

        // If ticket is old and in_progress, suggest resolved
        $daysOld = $ticket->created_at?->diffInDays(now()) ?? 0;
        $threshold = (int) config('triage.rules.resolved_after_days', 7);
        if ($daysOld > $threshold && $ticket->status === TicketStatus::IN_PROGRESS) {
            return TicketStatus::RESOLVED->value;
        }

        // Check for resolution keywords
        $description = strtolower($ticket->description);
        $resolutionKeywords = config('triage.keywords.resolution', []);
        
        foreach ($resolutionKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return TicketStatus::RESOLVED->value;
            }
        }

        // Keep current status if it makes sense
        return $ticket->status->value;
    }

    /**
     * Generate summary for rule-based triage
     *
     * @param Ticket $ticket
     * @param string $priority
     * @param string $status
     * @return string
     */
    private function generateSummary(Ticket $ticket, string $priority, string $status): string
    {
        $reasons = [];

        if ($priority !== $ticket->priority) {
            $reasons[] = "Priority changed from {$ticket->priority} to {$priority}";
        }

        if ($status !== $ticket->status) {
            $reasons[] = "Status changed from {$ticket->status} to {$status}";
        }

        if (empty($reasons)) {
            return "Current triage appears appropriate for this ticket.";
        }

        return "Suggested changes: " . implode('. ', $reasons) . ".";
    }

    /**
     * Generate LLM-style summary
     *
     * @param Ticket $ticket
     * @param string $priority
     * @param string $status
     * @return string
     */
    private function generateLLMSummary(Ticket $ticket, string $priority, string $status): string
    {
        $changes = [];
        
        if ($priority !== $ticket->priority) {
            $changes[] = "priority to {$priority}";
        }
        
        if ($status !== $ticket->status) {
            $changes[] = "status to {$status}";
        }

        if (empty($changes)) {
            return "After analyzing the ticket content, the current triage settings appear appropriate. No changes recommended at this time.";
        }

        $changesStr = implode(' and ', $changes);
        return "Based on the ticket content analysis, I recommend updating the {$changesStr}. This will help ensure proper prioritization and workflow.";
    }

    /**
     * Generate reasoning for LLM response
     *
     * @param Ticket $ticket
     * @param string $priority
     * @param string $status
     * @return string
     */
    private function generateReasoning(Ticket $ticket, string $priority, string $status): string
    {
        $factors = [];

        // Priority reasoning
        if ($priority === 'high') {
            $factors[] = "The ticket contains urgent or critical indicators";
        } elseif ($priority === 'low') {
            $factors[] = "This appears to be a non-critical enhancement or minor issue";
        } else {
            $factors[] = "The issue severity appears to be moderate";
        }

        // Status reasoning
        if ($status === TicketStatus::IN_PROGRESS->value && $ticket->assignee_id) {
            $factors[] = "An assignee is set, suggesting active work";
        } elseif ($status === TicketStatus::RESOLVED->value) {
            $factors[] = "Resolution indicators were found in the ticket";
        }

        return implode('. ', $factors) . '.';
    }

    /**
     * Calculate confidence score based on ticket data quality
     *
     * @param Ticket $ticket
     * @param string $suggestedPriority
     * @param string $suggestedStatus
     * @return float
     */
    private function calculateConfidence(Ticket $ticket, string $suggestedPriority, string $suggestedStatus): float
    {
        $confidence = 0.5; // Base confidence

        // Increase confidence if we have good data
        if (strlen($ticket->description) > 50) {
            $confidence += 0.1;
        }

        if (!empty($ticket->tags)) {
            $confidence += 0.1;
        }

        if ($ticket->assignee_id) {
            $confidence += 0.05;
        }

        // Increase confidence if suggestions differ from current values
        if ($suggestedPriority !== $ticket->priority) {
            $confidence += 0.1;
        }

        if ($suggestedStatus !== $ticket->status) {
            $confidence += 0.05;
        }

        return round(min($confidence, 0.95), 2);
    }
}
