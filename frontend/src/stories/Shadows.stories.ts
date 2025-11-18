import type { Meta, StoryObj } from '@storybook/angular';
import { ShadowTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Foundation/Shadows',
  parameters: {
    docs: {
      description: {
        component: 'Shadow system for elevation and depth in the UI.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ElevationShadows: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Elevation Shadows</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 32px;">
          ${Object.entries(ShadowTokens)
            .filter(([key]) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(key))
            .map(([key, value]) => `
            <div style="text-align: center;">
              <div style="
                background: white;
                padding: 32px;
                border-radius: 12px;
                box-shadow: ${value};
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 120px;
              ">
                <span style="font-size: 24px; font-weight: 600; color: #6b7280;">${key}</span>
              </div>
              <code style="font-size: 12px; color: #6b7280; word-break: break-all;">${value}</code>
            </div>
          `).join('')}
        </div>
      </div>
    `,
  }),
};

export const ColoredShadows: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Colored Shadows</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 32px;">
          <div style="text-align: center;">
            <div style="
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: ${ShadowTokens.primary};
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 120px;
            ">
              <span style="font-size: 18px; font-weight: 600; color: #2563eb;">Primary</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: ${ShadowTokens.success};
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 120px;
            ">
              <span style="font-size: 18px; font-weight: 600; color: #16a34a;">Success</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: ${ShadowTokens.warning};
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 120px;
            ">
              <span style="font-size: 18px; font-weight: 600; color: #f59e0b;">Warning</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: ${ShadowTokens.error};
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 120px;
            ">
              <span style="font-size: 18px; font-weight: 600; color: #dc2626;">Error</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Colored shadows for emphasis and semantic meaning.',
      },
    },
  },
};

export const InnerShadow: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Inner Shadow</h2>
        <div style="
          background: white;
          padding: 48px;
          border-radius: 12px;
          box-shadow: ${ShadowTokens.inner};
          text-align: center;
        ">
          <span style="font-size: 18px; color: #6b7280;">Inner shadow for inset effect</span>
        </div>
      </div>
    `,
  }),
};

export const ShadowComparison: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: linear-gradient(to bottom, #f9fafb, #e5e7eb);">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Interactive Cards with Shadows</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">
          <div style="
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: ${ShadowTokens.sm};
            transition: all 200ms ease;
            cursor: pointer;
          " onmouseover="this.style.boxShadow='${ShadowTokens.lg}'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='${ShadowTokens.sm}'; this.style.transform='translateY(0)'">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111827;">Card 1</h3>
            <p style="font-size: 14px; color: #6b7280;">Hover to see shadow elevation change</p>
          </div>
          
          <div style="
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: ${ShadowTokens.md};
            transition: all 200ms ease;
            cursor: pointer;
          " onmouseover="this.style.boxShadow='${ShadowTokens.xl}'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='${ShadowTokens.md}'; this.style.transform='translateY(0)'">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111827;">Card 2</h3>
            <p style="font-size: 14px; color: #6b7280;">Hover to see shadow elevation change</p>
          </div>
          
          <div style="
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: ${ShadowTokens.lg};
            transition: all 200ms ease;
            cursor: pointer;
          " onmouseover="this.style.boxShadow='${ShadowTokens['2xl']}'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='${ShadowTokens.lg}'; this.style.transform='translateY(0)'">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111827;">Card 3</h3>
            <p style="font-size: 14px; color: #6b7280;">Hover to see shadow elevation change</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of shadow transitions on hover.',
      },
    },
  },
};
