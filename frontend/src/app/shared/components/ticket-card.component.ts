import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PriorityBadgeComponent } from './priority-badge.component';

export interface TicketCardData {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  tags?: string[];
  assignee?: {
    name: string;
    email?: string;
  };
  created_at: string;
}

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    PriorityBadgeComponent
  ],
  template: `
    <mat-card 
      class="ticket-card"
      [class.clickable]="clickable"
      [class.loading]="loading"
      [class.error]="error"
      (click)="onCardClick()">
      
      @if (loading) {
        <div class="loading-overlay">
          <mat-icon class="spinner">refresh</mat-icon>
          <p>Loading...</p>
        </div>
      } @else if (error) {
        <div class="error-overlay">
          <mat-icon>error</mat-icon>
          <p>{{ errorMessage }}</p>
        </div>
      } @else {
        <mat-card-header>
          <mat-card-title>{{ ticket.title }}</mat-card-title>
          <mat-card-subtitle>
            #{{ ticket.id }} • {{ ticket.created_at | date:'short' }}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p class="description">{{ ticket.description }}</p>
          
          <div class="badges">
            <app-priority-badge [priority]="ticket.priority"></app-priority-badge>
            <mat-chip [class]="'status-' + ticket.status">
              {{ formatStatus(ticket.status) }}
            </mat-chip>
          </div>

          @if (ticket.tags && ticket.tags.length > 0) {
            <div class="tags">
              @for (tag of ticket.tags; track tag) {
                <mat-chip class="tag-chip">{{ tag }}</mat-chip>
              }
            </div>
          }

          @if (ticket.assignee) {
            <div class="assignee">
              <mat-icon>person</mat-icon>
              <span>{{ ticket.assignee.name }}</span>
            </div>
          }
        </mat-card-content>
      }
    </mat-card>
  `,
  styles: [`
    .ticket-card {
      position: relative;
      min-height: 200px;
      transition: all 0.2s ease-in-out;
      
      &.clickable {
        cursor: pointer;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      }
      
      &.loading, &.error {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .loading-overlay, .error-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
      
      p {
        margin: 0;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .loading-overlay mat-icon {
      animation: spin 1s linear infinite;
      color: #3f51b5;
    }

    .error-overlay mat-icon {
      color: #f44336;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .description {
      margin: 16px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
    }

    .badges {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .status-open { background-color: #2196f3; color: white; }
    .status-in_progress { background-color: #ff9800; color: white; }
    .status-resolved { background-color: #4caf50; color: white; }
    .status-closed { background-color: #9e9e9e; color: white; }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
      
      .tag-chip {
        font-size: 11px;
        min-height: 24px;
        padding: 4px 8px;
      }
    }

    .assignee {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class TicketCardComponent {
  @Input() ticket!: TicketCardData;
  @Input() clickable: boolean = true;
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = 'Failed to load ticket';
  
  @Output() cardClick = new EventEmitter<number>();

  onCardClick(): void {
    if (this.clickable && !this.loading && !this.error) {
      this.cardClick.emit(this.ticket.id);
    }
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
