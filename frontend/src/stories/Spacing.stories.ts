import type { Meta, StoryObj } from '@storybook/angular';
import { SpacingTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component: 'Spacing scale based on 4px units for consistent layouts and component spacing.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SpacingScale: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Spacing Scale</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${Object.entries(SpacingTokens)
            .filter(([key]) => !isNaN(Number(key)) || ['xs', 'sm', 'md', 'lg', 'xl'].includes(key))
            .map(([key, value]) => `
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="min-width: 80px; font-weight: 600; color: #111827; font-size: 14px;">${key}</div>
              <div style="background: #2563eb; height: 24px; width: ${value};"></div>
              <code style="font-size: 12px; color: #6b7280; min-width: 60px;">${value}</code>
            </div>
          `).join('')}
        </div>
      </div>
    `,
  }),
};

export const SpacingExamples: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Spacing Examples</h2>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Card with consistent spacing</h3>
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: ${SpacingTokens[6]}; background: #f9fafb;">
            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: ${SpacingTokens[2]}; color: #111827;">Card Title</h4>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: ${SpacingTokens[4]};">
              This card demonstrates consistent spacing using design tokens.
            </p>
            <button style="background: #2563eb; color: white; border: none; padding: ${SpacingTokens[2]} ${SpacingTokens[4]}; border-radius: 6px; font-weight: 500; cursor: pointer;">
              Action
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Stack with gaps</h3>
          <div style="display: flex; flex-direction: column; gap: ${SpacingTokens[3]};">
            <div style="padding: ${SpacingTokens[4]}; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">Item 1</div>
            <div style="padding: ${SpacingTokens[4]}; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">Item 2</div>
            <div style="padding: ${SpacingTokens[4]}; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">Item 3</div>
          </div>
        </div>
        
        <div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Horizontal spacing</h3>
          <div style="display: flex; gap: ${SpacingTokens[4]}; flex-wrap: wrap;">
            <div style="padding: ${SpacingTokens[3]} ${SpacingTokens[6]}; background: #dcfce7; border-radius: 8px; border: 1px solid #bbf7d0;">Tag 1</div>
            <div style="padding: ${SpacingTokens[3]} ${SpacingTokens[6]}; background: #dcfce7; border-radius: 8px; border: 1px solid #bbf7d0;">Tag 2</div>
            <div style="padding: ${SpacingTokens[3]} ${SpacingTokens[6]}; background: #dcfce7; border-radius: 8px; border: 1px solid #bbf7d0;">Tag 3</div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of spacing tokens in use.',
      },
    },
  },
};
