import type { Meta, StoryObj } from '@storybook/angular';
import { TicketCardComponent, TicketCardData } from './ticket-card.component';

const mockTicket: TicketCardData = {
  id: 1,
  title: 'Cannot login to application',
  description: 'Users are experiencing 500 errors when trying to log in. This affects multiple users and needs immediate attention.',
  priority: 'high',
  status: 'open',
  tags: ['auth', 'urgent', 'bug'],
  assignee: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  created_at: '2025-11-17T10:00:00Z'
};

const meta: Meta<TicketCardComponent> = {
  title: 'Design System/Components/Ticket Card',
  component: TicketCardComponent,
  tags: ['autodocs'],
  argTypes: {
    ticket: {
      control: 'object',
      description: 'Ticket data to display',
      table: {
        type: { summary: 'TicketCardData' },
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Failed to load ticket' },
      },
    },
    cardClick: {
      action: 'cardClick',
      description: 'Emitted when card is clicked',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A modern card component for displaying ticket information with priority badges, status indicators, tags, and assignee details. Features smooth hover animations and multiple states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TicketCardComponent>;

// Default state
export const Default: Story = {
  args: {
    ticket: mockTicket,
    clickable: true,
    loading: false,
    error: false,
  },
};

// Low priority ticket
export const LowPriority: Story = {
  args: {
    ticket: {
      ...mockTicket,
      priority: 'low',
      status: 'in_progress',
      title: 'Update documentation',
      description: 'Need to update API documentation with latest changes.',
    },
  },
};

// Medium priority ticket
export const MediumPriority: Story = {
  args: {
    ticket: {
      ...mockTicket,
      priority: 'medium',
      status: 'resolved',
      title: 'Improve UI responsiveness',
      description: 'Make the dashboard more responsive on mobile devices.',
    },
  },
};

// Critical priority ticket
export const CriticalPriority: Story = {
  args: {
    ticket: {
      ...mockTicket,
      id: 9999,
      priority: 'critical',
      status: 'in_progress',
      title: 'Database connection failure in production',
      description: 'Critical issue: Production database is intermittently losing connections, affecting all users.',
      tags: ['critical', 'database', 'production'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical priority ticket with urgent status.',
      },
    },
  },
};

// Closed ticket
export const ClosedTicket: Story = {
  args: {
    ticket: {
      ...mockTicket,
      status: 'closed',
      priority: 'low',
      title: 'Feature request: Dark mode',
      description: 'Add dark mode support to the application.',
    },
  },
};

// Ticket without assignee
export const NoAssignee: Story = {
  args: {
    ticket: {
      ...mockTicket,
      assignee: undefined,
      title: 'Unassigned ticket',
      description: 'This ticket has not been assigned to anyone yet.',
    },
  },
};

// Ticket without tags
export const NoTags: Story = {
  args: {
    ticket: {
      ...mockTicket,
      tags: [],
      title: 'Simple ticket',
      description: 'A basic ticket without any tags.',
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ticket: mockTicket,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card in loading state with spinner animation.',
      },
    },
  },
};

// Error state
export const Error: Story = {
  args: {
    ticket: mockTicket,
    error: true,
    errorMessage: 'Failed to load ticket data',
  },
  parameters: {
    docs: {
      description: {
        story: 'Card in error state with error message.',
      },
    },
  },
};

// Non-clickable
export const NonClickable: Story = {
  args: {
    ticket: mockTicket,
    clickable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card without hover effects and click action.',
      },
    },
  },
};

// All statuses showcase
export const AllStatuses: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
        <app-ticket-card [ticket]="{
          id: 1,
          title: 'Open Ticket',
          description: 'This is an open ticket.',
          priority: 'high',
          status: 'open',
          created_at: '2025-11-17T10:00:00Z'
        }"></app-ticket-card>
        <app-ticket-card [ticket]="{
          id: 2,
          title: 'In Progress Ticket',
          description: 'This ticket is being worked on.',
          priority: 'medium',
          status: 'in_progress',
          created_at: '2025-11-17T10:00:00Z'
        }"></app-ticket-card>
        <app-ticket-card [ticket]="{
          id: 3,
          title: 'Resolved Ticket',
          description: 'This ticket has been resolved.',
          priority: 'low',
          status: 'resolved',
          created_at: '2025-11-17T10:00:00Z'
        }"></app-ticket-card>
        <app-ticket-card [ticket]="{
          id: 4,
          title: 'Closed Ticket',
          description: 'This ticket is closed.',
          priority: 'low',
          status: 'closed',
          created_at: '2025-11-17T10:00:00Z'
        }"></app-ticket-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all ticket statuses.',
      },
    },
  },
};

// All priorities showcase
export const AllPriorities: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; padding: 20px; background: #f9fafb;">
        <app-ticket-card [ticket]="{
          id: 1001,
          title: 'Update documentation',
          description: 'Documentation needs to be updated to reflect recent API changes.',
          priority: 'low',
          status: 'open',
          tags: ['docs'],
          assignee: { name: 'Sarah Johnson', email: 'sarah@example.com' },
          created_at: '2025-11-20T14:30:00Z'
        }"></app-ticket-card>
        
        <app-ticket-card [ticket]="{
          id: 2002,
          title: 'Improve UI responsiveness',
          description: 'Make the dashboard more responsive on tablet devices.',
          priority: 'medium',
          status: 'in_progress',
          tags: ['ui', 'enhancement'],
          assignee: { name: 'Alex Kim', email: 'alex@example.com' },
          created_at: '2025-11-19T11:00:00Z'
        }"></app-ticket-card>
        
        <app-ticket-card [ticket]="{
          id: 3003,
          title: 'Login page not responsive',
          description: 'Users experiencing issues on mobile devices when logging in.',
          priority: 'high',
          status: 'open',
          tags: ['bug', 'mobile', 'auth'],
          assignee: { name: 'John Doe', email: 'john@example.com' },
          created_at: '2025-11-18T09:15:00Z'
        }"></app-ticket-card>
        
        <app-ticket-card [ticket]="{
          id: 9999,
          title: 'Database connection failure',
          description: 'Critical: Production database losing connections intermittently.',
          priority: 'critical',
          status: 'in_progress',
          tags: ['critical', 'database', 'production'],
          assignee: { name: 'Mike Chen', email: 'mike@example.com' },
          created_at: '2025-11-17T08:00:00Z'
        }"></app-ticket-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all priority levels in a grid layout.',
      },
    },
  },
};

// Dark background
export const OnDarkBackground: Story = {
  args: {
    ticket: mockTicket,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
