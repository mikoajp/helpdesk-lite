import type { Meta, StoryObj } from '@storybook/angular';
import { ColorTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Foundation/Colors',
  parameters: {
    docs: {
      description: {
        component: 'Color palette and semantic color definitions for the design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ColorSwatchTemplate = (colors: any, title: string) => `
  <div style="margin-bottom: 48px;">
    <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 16px; color: #111827;">${title}</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
      ${Object.entries(colors).map(([key, value]: [string, any]) => {
        if (typeof value === 'object') {
          return Object.entries(value).map(([subKey, subValue]: [string, any]) => `
            <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="background-color: ${subValue}; height: 80px;"></div>
              <div style="padding: 12px; background: white;">
                <div style="font-size: 14px; font-weight: 600; color: #111827;">${key}.${subKey}</div>
                <div style="font-size: 12px; color: #6b7280; font-family: monospace; margin-top: 4px;">${subValue}</div>
              </div>
            </div>
          `).join('');
        }
        return `
          <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="background-color: ${value}; height: 80px;"></div>
            <div style="padding: 12px; background: white;">
              <div style="font-size: 14px; font-weight: 600; color: #111827;">${key}</div>
              <div style="font-size: 12px; color: #6b7280; font-family: monospace; margin-top: 4px;">${value}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  </div>
`;

export const Primary: Story = {
  render: () => ({
    template: ColorSwatchTemplate(ColorTokens.primary, 'Primary Colors'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Primary brand colors used throughout the application.',
      },
    },
  },
};

export const Secondary: Story = {
  render: () => ({
    template: ColorSwatchTemplate(ColorTokens.secondary, 'Secondary Colors'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Secondary colors for accents and supporting elements.',
      },
    },
  },
};

export const Status: Story = {
  render: () => ({
    template: ColorSwatchTemplate(ColorTokens.status, 'Status Colors'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Colors representing different ticket statuses.',
      },
    },
  },
};

export const Priority: Story = {
  render: () => ({
    template: ColorSwatchTemplate(ColorTokens.priority, 'Priority Colors'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Colors representing different priority levels.',
      },
    },
  },
};

export const Semantic: Story = {
  render: () => ({
    template: `
      ${ColorSwatchTemplate(ColorTokens.success, 'Success')}
      ${ColorSwatchTemplate(ColorTokens.warning, 'Warning')}
      ${ColorSwatchTemplate(ColorTokens.error, 'Error')}
      ${ColorSwatchTemplate(ColorTokens.info, 'Info')}
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Semantic colors for feedback and notifications.',
      },
    },
  },
};

export const Neutral: Story = {
  render: () => ({
    template: ColorSwatchTemplate(ColorTokens.neutral.gray, 'Neutral Grays'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Neutral gray scale for text, borders, and backgrounds.',
      },
    },
  },
};

export const Text: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Text Colors</h2>
        ${Object.entries(ColorTokens.text).map(([key, value]) => `
          <div style="margin-bottom: 16px;">
            <span style="color: ${value}; font-size: 16px; display: inline-block; width: 200px;">${key}</span>
            <code style="color: #6b7280; font-size: 14px;">${value}</code>
          </div>
        `).join('')}
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Text colors for different contexts and hierarchies.',
      },
    },
  },
};

export const Background: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
        ${Object.entries(ColorTokens.background).map(([key, value]) => `
          <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
            <div style="background-color: ${value}; height: 100px; border-bottom: 1px solid #e5e7eb;"></div>
            <div style="padding: 12px; background: white;">
              <div style="font-size: 14px; font-weight: 600; color: #111827;">${key}</div>
              <div style="font-size: 12px; color: #6b7280; font-family: monospace; margin-top: 4px;">${value}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Background colors for different surfaces and elevations.',
      },
    },
  },
};
