import type { Meta, StoryObj } from '@storybook/angular';
import { PriorityBadgeComponent } from './priority-badge.component';

const meta: Meta<PriorityBadgeComponent> = {
  title: 'Design System/Components/Priority Badge',
  component: PriorityBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    priority: {
      control: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      description: 'Priority level of the badge',
      table: {
        type: { summary: "'low' | 'medium' | 'high' | 'critical'" },
        defaultValue: { summary: 'medium' },
      },
    },
    label: {
      control: 'text',
      description: 'Custom label text (optional)',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the badge is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A modern badge component for displaying ticket priority levels with color coding, visual indicators, and smooth animations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PriorityBadgeComponent>;

// Default state
export const Default: Story = {
  args: {
    priority: 'medium',
  },
};

// Low priority
export const Low: Story = {
  args: {
    priority: 'low',
  },
  parameters: {
    docs: {
      description: {
        story: 'Low priority badge with green color.',
      },
    },
  },
};

// Medium priority
export const Medium: Story = {
  args: {
    priority: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium priority badge with orange color.',
      },
    },
  },
};

// High priority
export const High: Story = {
  args: {
    priority: 'high',
  },
  parameters: {
    docs: {
      description: {
        story: 'High priority badge with red color - indicates urgent items.',
      },
    },
  },
};

// Custom label
export const CustomLabel: Story = {
  args: {
    priority: 'high',
    label: 'URGENT',
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge with custom label text.',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    priority: 'medium',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled badge with reduced opacity.',
      },
    },
  },
};

// Critical priority
export const Critical: Story = {
  args: {
    priority: 'critical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical priority badge with dark red color - indicates extremely urgent items.',
      },
    },
  },
};

// All priorities showcase
export const AllPriorities: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; padding: 20px; background: white; border-radius: 8px;">
        <app-priority-badge priority="low"></app-priority-badge>
        <app-priority-badge priority="medium"></app-priority-badge>
        <app-priority-badge priority="high"></app-priority-badge>
        <app-priority-badge priority="critical"></app-priority-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all priority levels together.',
      },
    },
  },
};

// Dark background
export const OnDarkBackground: Story = {
  args: {
    priority: 'high',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Badge displayed on dark background.',
      },
    },
  },
};
