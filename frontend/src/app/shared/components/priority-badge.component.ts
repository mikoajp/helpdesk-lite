import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

export type Priority = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip [class]="'priority-badge priority-' + priority" [disabled]="disabled">
      {{ label || priority }}
    </mat-chip>
  `,
  styles: [`
    .priority-badge {
      font-weight: 500;
      text-transform: uppercase;
      font-size: 12px;
      
      &.priority-low {
        background-color: #4caf50 !important;
        color: white !important;
      }
      
      &.priority-medium {
        background-color: #ff9800 !important;
        color: white !important;
      }
      
      &.priority-high {
        background-color: #f44336 !important;
        color: white !important;
      }
    }
  `]
})
export class PriorityBadgeComponent {
  @Input() priority: Priority = 'medium';
  @Input() label?: string;
  @Input() disabled: boolean = false;
}
