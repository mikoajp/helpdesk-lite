import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorTokens, SpacingTokens, RadiusTokens, ShadowTokens } from '../design-tokens';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="priority-badge" 
      [class]="'priority-' + priority"
      [class.disabled]="disabled"
      [attr.aria-label]="(label || priority) + ' priority'"
      role="status">
      <span class="priority-dot"></span>
      <span class="priority-text">{{ label || priority }}</span>
    </span>
  `,
  styles: [`
    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: ${SpacingTokens[1.5]};
      padding: ${SpacingTokens[1.5]} ${SpacingTokens[3]};
      border-radius: ${RadiusTokens.full};
      font-size: 13px;
      font-weight: 600;
      text-transform: capitalize;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      line-height: 1;
      white-space: nowrap;
      cursor: default;
    }

    .priority-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .priority-text {
      letter-spacing: 0.025em;
    }

    .priority-low {
      background-color: ${ColorTokens.priority.low.bg};
      color: ${ColorTokens.priority.low.text};
      border: 1px solid ${ColorTokens.priority.low.border};
    }

    .priority-low .priority-dot {
      background-color: ${ColorTokens.priority.low.main};
      box-shadow: 0 0 0 2px ${ColorTokens.priority.low.bg};
    }

    .priority-medium {
      background-color: ${ColorTokens.priority.medium.bg};
      color: ${ColorTokens.priority.medium.text};
      border: 1px solid ${ColorTokens.priority.medium.border};
    }

    .priority-medium .priority-dot {
      background-color: ${ColorTokens.priority.medium.main};
      box-shadow: 0 0 0 2px ${ColorTokens.priority.medium.bg};
    }

    .priority-high {
      background-color: ${ColorTokens.priority.high.bg};
      color: ${ColorTokens.priority.high.text};
      border: 1px solid ${ColorTokens.priority.high.border};
    }

    .priority-high .priority-dot {
      background-color: ${ColorTokens.priority.high.main};
      box-shadow: 0 0 0 2px ${ColorTokens.priority.high.bg};
    }

    .priority-critical {
      background-color: ${ColorTokens.priority.critical.bg};
      color: ${ColorTokens.priority.critical.text};
      border: 1px solid ${ColorTokens.priority.critical.border};
    }

    .priority-critical .priority-dot {
      background-color: ${ColorTokens.priority.critical.main};
      box-shadow: 0 0 0 2px ${ColorTokens.priority.critical.bg};
    }

    .priority-badge:not(.disabled):hover {
      transform: translateY(-1px);
      box-shadow: ${ShadowTokens.sm};
    }

    .priority-badge.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PriorityBadgeComponent {
  @Input() priority: Priority = 'medium';
  @Input() label?: string;
  @Input() disabled: boolean = false;
}
