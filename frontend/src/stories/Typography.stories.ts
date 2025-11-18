import type { Meta, StoryObj } from '@storybook/angular';
import { TypographyTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Foundation/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Typography system including font families, sizes, weights, and line heights.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const FontFamilies: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Font Families</h2>
        ${Object.entries(TypographyTokens.fontFamily).map(([key, value]) => `
          <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">${key}</div>
            <div style="font-family: ${value}; font-size: 18px; color: #111827; margin-bottom: 8px;">
              The quick brown fox jumps over the lazy dog
            </div>
            <code style="font-size: 12px; color: #6b7280;">${value}</code>
          </div>
        `).join('')}
      </div>
    `,
  }),
};

export const FontSizes: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Font Sizes</h2>
        ${Object.entries(TypographyTokens.fontSize).map(([key, value]) => `
          <div style="margin-bottom: 16px; padding: 12px; border-left: 3px solid #2563eb; background: #f9fafb;">
            <div style="font-size: ${value}; color: #111827; margin-bottom: 4px;">
              ${key} - The quick brown fox
            </div>
            <code style="font-size: 12px; color: #6b7280;">${value}</code>
          </div>
        `).join('')}
      </div>
    `,
  }),
};

export const FontWeights: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Font Weights</h2>
        ${Object.entries(TypographyTokens.fontWeight).map(([key, value]) => `
          <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
            <div style="font-weight: ${value}; font-size: 18px; color: #111827; margin-bottom: 4px;">
              ${key} (${value}) - The quick brown fox jumps over the lazy dog
            </div>
          </div>
        `).join('')}
      </div>
    `,
  }),
};

export const LineHeights: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Line Heights</h2>
        ${Object.entries(TypographyTokens.lineHeight).map(([key, value]) => `
          <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">${key} (${value})</div>
            <div style="line-height: ${value}; font-size: 16px; color: #111827;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </div>
          </div>
        `).join('')}
      </div>
    `,
  }),
};

export const LetterSpacing: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Letter Spacing</h2>
        ${Object.entries(TypographyTokens.letterSpacing).map(([key, value]) => `
          <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
            <div style="letter-spacing: ${value}; font-size: 18px; color: #111827; margin-bottom: 4px;">
              ${key} (${value}) - The quick brown fox jumps over the lazy dog
            </div>
          </div>
        `).join('')}
      </div>
    `,
  }),
};

export const TypographyScale: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h1 style="font-size: 48px; font-weight: 700; color: #111827; margin-bottom: 16px;">Heading 1</h1>
        <h2 style="font-size: 36px; font-weight: 600; color: #111827; margin-bottom: 16px;">Heading 2</h2>
        <h3 style="font-size: 30px; font-weight: 600; color: #111827; margin-bottom: 16px;">Heading 3</h3>
        <h4 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 16px;">Heading 4</h4>
        <h5 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">Heading 5</h5>
        <h6 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 24px;">Heading 6</h6>
        
        <p style="font-size: 16px; line-height: 1.5; color: #111827; margin-bottom: 16px;">
          This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and <a href="#" style="color: #2563eb; text-decoration: none;">a link</a>. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        
        <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
          Small text: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete typography scale showing all heading levels and text styles.',
      },
    },
  },
};
