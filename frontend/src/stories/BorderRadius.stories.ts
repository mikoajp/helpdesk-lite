import type { Meta, StoryObj } from '@storybook/angular';
import { RadiusTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Foundation/Border Radius',
  parameters: {
    docs: {
      description: {
        component: 'Border radius tokens for consistent rounded corners throughout the design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const RadiusScale: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Border Radius Scale</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 24px;">
          ${Object.entries(RadiusTokens).map(([key, value]) => `
            <div style="text-align: center;">
              <div style="
                width: 120px;
                height: 120px;
                background: linear-gradient(135deg, #2563eb, #7dd3fc);
                border-radius: ${value};
                margin: 0 auto 12px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="color: white; font-weight: 600;">${key}</span>
              </div>
              <code style="font-size: 12px; color: #6b7280;">${value}</code>
            </div>
          `).join('')}
        </div>
      </div>
    `,
  }),
};

export const ButtonExamples: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Button Radius Examples</h2>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: ${RadiusTokens.none}; font-weight: 500; cursor: pointer;">
            None
          </button>
          <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: ${RadiusTokens.sm}; font-weight: 500; cursor: pointer;">
            Small
          </button>
          <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: ${RadiusTokens.md}; font-weight: 500; cursor: pointer;">
            Medium
          </button>
          <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: ${RadiusTokens.lg}; font-weight: 500; cursor: pointer;">
            Large
          </button>
          <button style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: ${RadiusTokens.full}; font-weight: 500; cursor: pointer;">
            Full
          </button>
        </div>
      </div>
    `,
  }),
};

export const CardExamples: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Card Radius Examples</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">
          <div style="background: white; padding: 24px; border-radius: ${RadiusTokens.sm}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">Small Radius</h3>
            <p style="font-size: 14px; color: #6b7280;">radius: ${RadiusTokens.sm}</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: ${RadiusTokens.md}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">Medium Radius</h3>
            <p style="font-size: 14px; color: #6b7280;">radius: ${RadiusTokens.md}</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: ${RadiusTokens.lg}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">Large Radius</h3>
            <p style="font-size: 14px; color: #6b7280;">radius: ${RadiusTokens.lg}</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: ${RadiusTokens.xl}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">Extra Large</h3>
            <p style="font-size: 14px; color: #6b7280;">radius: ${RadiusTokens.xl}</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: ${RadiusTokens['2xl']}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">2X Large</h3>
            <p style="font-size: 14px; color: #6b7280;">radius: ${RadiusTokens['2xl']}</p>
          </div>
        </div>
      </div>
    `,
  }),
};
