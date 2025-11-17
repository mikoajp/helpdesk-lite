import type { Meta, StoryObj } from '@storybook/angular';
import { TriageSuggestionPanelComponent, TriageSuggestion } from './triage-suggestion-panel.component';

const mockSuggestion: TriageSuggestion = {
  suggested_priority: 'high',
  suggested_status: 'in_progress',
  summary: 'Based on the ticket description mentioning login errors affecting multiple users, this appears to be a critical authentication issue requiring immediate attention.',
  confidence: 0.85
};

const meta: Meta<TriageSuggestionPanelComponent> = {
  title: 'Design System/TriageSuggestionPanel',
  component: TriageSuggestionPanelComponent,
  tags: ['autodocs'],
  argTypes: {
    suggestion: {
      control: 'object',
      description: 'Triage suggestion data',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether actions are disabled',
    },
    subtitle: {
      control: 'text',
      description: 'Panel subtitle',
    },
    accept: {
      action: 'accept',
      description: 'Emitted when suggestion is accepted',
    },
    reject: {
      action: 'reject',
      description: 'Emitted when suggestion is rejected',
    },
    requestSuggestion: {
      action: 'requestSuggestion',
      description: 'Emitted when user requests a suggestion',
    },
    retry: {
      action: 'retry',
      description: 'Emitted when user retries after error',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A panel component for displaying AI-powered triage suggestions with accept/reject actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TriageSuggestionPanelComponent>;

// Default - Empty state
export const Default: Story = {
  args: {
    suggestion: null,
    loading: false,
    error: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial state before requesting a suggestion.',
      },
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    suggestion: null,
    loading: true,
    error: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while AI is analyzing the ticket.',
      },
    },
  },
};

// With suggestion - High priority
export const WithHighPrioritySuggestion: Story = {
  args: {
    suggestion: mockSuggestion,
    loading: false,
    error: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displaying a high priority suggestion with high confidence.',
      },
    },
  },
};

// Medium priority suggestion
export const WithMediumPrioritySuggestion: Story = {
  args: {
    suggestion: {
      suggested_priority: 'medium',
      suggested_status: 'open',
      summary: 'This ticket describes a UI improvement request that should be prioritized for the next sprint.',
      confidence: 0.65
    },
    loading: false,
    error: false,
  },
};

// Low priority suggestion
export const WithLowPrioritySuggestion: Story = {
  args: {
    suggestion: {
      suggested_priority: 'low',
      suggested_status: 'open',
      summary: 'This appears to be a minor documentation update that can be addressed when time permits.',
      confidence: 0.45
    },
    loading: false,
    error: false,
  },
};

// Low confidence suggestion
export const LowConfidence: Story = {
  args: {
    suggestion: {
      suggested_priority: 'medium',
      suggested_status: 'open',
      summary: 'Unable to determine clear priority from the ticket description. Manual review recommended.',
      confidence: 0.3
    },
    loading: false,
    error: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Suggestion with low confidence score.',
      },
    },
  },
};

// Error state
export const Error: Story = {
  args: {
    suggestion: null,
    loading: false,
    error: true,
    errorMessage: 'Failed to connect to AI service. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when suggestion request fails.',
      },
    },
  },
};

// Disabled actions
export const DisabledActions: Story = {
  args: {
    suggestion: mockSuggestion,
    loading: false,
    error: false,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel with disabled accept/reject actions.',
      },
    },
  },
};

// Custom subtitle
export const CustomSubtitle: Story = {
  args: {
    suggestion: mockSuggestion,
    loading: false,
    error: false,
    subtitle: 'GPT-4 Analysis',
  },
};

// All states showcase
export const AllStates: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">
        <div>
          <h3>Empty State</h3>
          <app-triage-suggestion-panel></app-triage-suggestion-panel>
        </div>
        <div>
          <h3>Loading State</h3>
          <app-triage-suggestion-panel [loading]="true"></app-triage-suggestion-panel>
        </div>
        <div>
          <h3>With Suggestion</h3>
          <app-triage-suggestion-panel [suggestion]="{
            suggested_priority: 'high',
            suggested_status: 'in_progress',
            summary: 'Critical issue requiring immediate attention.',
            confidence: 0.85
          }"></app-triage-suggestion-panel>
        </div>
        <div>
          <h3>Error State</h3>
          <app-triage-suggestion-panel [error]="true"></app-triage-suggestion-panel>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all panel states.',
      },
    },
  },
};

// Dark background
export const OnDarkBackground: Story = {
  args: {
    suggestion: mockSuggestion,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
