import type { Meta, StoryObj } from '@storybook/angular';
import { ColorTokens, SpacingTokens, RadiusTokens, ShadowTokens } from '../app/shared/design-tokens';

const meta: Meta = {
  title: 'Design System/Components/Buttons',
  parameters: {
    docs: {
      description: {
        component: 'Button component variations showcasing the design system tokens in action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllButtonVariants: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: white; border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #111827;">Button Variants</h2>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Primary Buttons</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.primary.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.primary[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.primary.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Primary Button
            </button>
            
            <button style="
              padding: ${SpacingTokens[2]} ${SpacingTokens[4]};
              background: ${ColorTokens.primary.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.primary[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.primary.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Small
            </button>
            
            <button style="
              padding: ${SpacingTokens[3]} ${SpacingTokens[6]};
              background: ${ColorTokens.primary.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 16px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.primary[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.primary.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Large
            </button>
            
            <button disabled style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.neutral.gray[300]};
              color: ${ColorTokens.neutral.gray[500]};
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: not-allowed;
              opacity: 0.6;
            ">
              Disabled
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Secondary Buttons</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: white;
              color: ${ColorTokens.primary.main};
              border: 2px solid ${ColorTokens.primary.main};
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
            " onmouseover="this.style.background='${ColorTokens.primary[50]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.sm}'" 
               onmouseout="this.style.background='white'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              Secondary Button
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.neutral.gray[100]};
              color: ${ColorTokens.text.primary};
              border: 1px solid ${ColorTokens.border.default};
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
            " onmouseover="this.style.background='${ColorTokens.neutral.gray[200]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.sm}'" 
               onmouseout="this.style.background='${ColorTokens.neutral.gray[100]}'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              Gray Button
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Semantic Buttons</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.success.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.success[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.success.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Success
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.warning.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.warning[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.warning.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Warning
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.error.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.error[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.error.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Danger
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: ${ColorTokens.info.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
            " onmouseover="this.style.background='${ColorTokens.info[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.info.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              Info
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Ghost Buttons</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: transparent;
              color: ${ColorTokens.primary.main};
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
            " onmouseover="this.style.background='${ColorTokens.primary[50]}'" 
               onmouseout="this.style.background='transparent'">
              Ghost Button
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]} ${SpacingTokens[5]};
              background: transparent;
              color: ${ColorTokens.text.primary};
              border: none;
              border-radius: ${RadiusTokens.md};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
            " onmouseover="this.style.background='${ColorTokens.neutral.gray[100]}'" 
               onmouseout="this.style.background='transparent'">
              Text Button
            </button>
          </div>
        </div>
        
        <div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Icon Buttons</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button style="
              padding: ${SpacingTokens[2.5]};
              background: ${ColorTokens.primary.main};
              color: white;
              border: none;
              border-radius: ${RadiusTokens.full};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: ${ShadowTokens.sm};
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.background='${ColorTokens.primary[700]}'; this.style.transform='translateY(-1px)'; this.style.boxShadow='${ShadowTokens.md}'" 
               onmouseout="this.style.background='${ColorTokens.primary.main}'; this.style.transform='translateY(0)'; this.style.boxShadow='${ShadowTokens.sm}'">
              +
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]};
              background: transparent;
              color: ${ColorTokens.text.primary};
              border: 1px solid ${ColorTokens.border.default};
              border-radius: ${RadiusTokens.full};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.background='${ColorTokens.neutral.gray[100]}'; this.style.transform='translateY(-1px)'" 
               onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'">
              ✓
            </button>
            
            <button style="
              padding: ${SpacingTokens[2.5]};
              background: transparent;
              color: ${ColorTokens.error.main};
              border: 1px solid ${ColorTokens.error.main};
              border-radius: ${RadiusTokens.full};
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.background='${ColorTokens.error[50]}'; this.style.transform='translateY(-1px)'" 
               onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'">
              ×
            </button>
          </div>
        </div>
      </div>
    `,
  }),
};
