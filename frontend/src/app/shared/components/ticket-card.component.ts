import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityBadgeComponent } from './priority-badge.component';
import { ColorTokens, SpacingTokens, RadiusTokens, ShadowTokens } from '../design-tokens';

export interface TicketCardData {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  tags?: string[];
  assignee?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  created_at: string;
}

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    CommonModule,
    PriorityBadgeComponent
  ],
  template: `
    <div 
      class="ticket-card"
      [class.clickable]="clickable"
      [class.loading]="loading"
      [class.error]="error"
      (click)="onCardClick()">
      
      @if (loading) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      } @else if (error) {
        <div class="error-overlay">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
          </svg>
          <p>{{ errorMessage }}</p>
        </div>
      } @else {
        <div class="card-header">
          <div class="header-top">
            <span class="ticket-id">#{{ ticket.id }}</span>
            <span class="status-badge status-{{ ticket.status }}">
              {{ formatStatus(ticket.status) }}
            </span>
          </div>
          <h3 class="ticket-title">{{ ticket.title }}</h3>
          <p class="ticket-meta">{{ ticket.created_at | date:'MMM d, y' }}</p>
        </div>
        
        <div class="card-content">
          <p class="description">{{ ticket.description }}</p>
          
          <div class="card-footer">
            <div class="footer-left">
              <app-priority-badge [priority]="ticket.priority"></app-priority-badge>
              
              @if (ticket.tags && ticket.tags.length > 0) {
                <div class="tags">
                  @for (tag of ticket.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              }
            </div>

            @if (ticket.assignee) {
              <div class="assignee">
                @if (ticket.assignee.avatar) {
                  <img [src]="ticket.assignee.avatar" [alt]="ticket.assignee.name" class="avatar">
                } @else {
                  <div class="avatar-placeholder">
                    {{ ticket.assignee.name.charAt(0).toUpperCase() }}
                  </div>
                }
                <span class="assignee-name">{{ ticket.assignee.name }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ticket-card {
      position: relative;
      background: ${ColorTokens.background.paper};
      border: 1px solid ${ColorTokens.border.default};
      border-radius: ${RadiusTokens.lg};
      padding: ${SpacingTokens[6]};
      min-height: 240px;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: ${ShadowTokens.sm};
    }
    
    .ticket-card.clickable {
      cursor: pointer;
    }
    
    .ticket-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: ${ShadowTokens.lg};
      border-color: ${ColorTokens.primary[300]};
    }
    
    .ticket-card.loading,
    .ticket-card.error {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 240px;
    }

    .loading-overlay,
    .error-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid ${ColorTokens.border.default};
      border-top-color: ${ColorTokens.primary.main};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: ${SpacingTokens[3]};
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .loading-overlay p {
      margin: 0;
      color: ${ColorTokens.text.secondary};
      font-size: 14px;
    }
    
    .error-icon {
      width: 48px;
      height: 48px;
      color: ${ColorTokens.error.main};
      margin-bottom: ${SpacingTokens[3]};
    }
    
    .error-overlay p {
      margin: 0;
      color: ${ColorTokens.text.secondary};
      font-size: 14px;
    }

    .card-header {
      margin-bottom: ${SpacingTokens[4]};
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${SpacingTokens[3]};
    }
    
    .ticket-id {
      font-size: 13px;
      font-weight: 600;
      color: ${ColorTokens.text.tertiary};
      font-family: 'JetBrains Mono', monospace;
    }
    
    .status-badge {
      padding: ${SpacingTokens[1]} ${SpacingTokens[3]};
      border-radius: ${RadiusTokens.full};
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.025em;
    }
    
    .status-open {
      background-color: ${ColorTokens.status.open.bg};
      color: ${ColorTokens.status.open.main};
      border: 1px solid ${ColorTokens.status.open.border};
    }
    
    .status-in_progress {
      background-color: ${ColorTokens.status.inProgress.bg};
      color: ${ColorTokens.status.inProgress.main};
      border: 1px solid ${ColorTokens.status.inProgress.border};
    }
    
    .status-resolved {
      background-color: ${ColorTokens.status.resolved.bg};
      color: ${ColorTokens.status.resolved.main};
      border: 1px solid ${ColorTokens.status.resolved.border};
    }
    
    .status-closed {
      background-color: ${ColorTokens.status.closed.bg};
      color: ${ColorTokens.status.closed.main};
      border: 1px solid ${ColorTokens.status.closed.border};
    }
    
    .ticket-title {
      margin: 0 0 ${SpacingTokens[2]} 0;
      font-size: 18px;
      font-weight: 600;
      color: ${ColorTokens.text.primary};
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .ticket-meta {
      margin: 0;
      font-size: 13px;
      color: ${ColorTokens.text.tertiary};
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: ${SpacingTokens[4]};
    }
    
    .description {
      margin: 0;
      font-size: 14px;
      color: ${ColorTokens.text.secondary};
      line-height: 1.6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: ${SpacingTokens[3]};
      margin-top: auto;
    }
    
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: ${SpacingTokens[3]};
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: ${SpacingTokens[2]};
    }
    
    .tag {
      padding: ${SpacingTokens[1]} ${SpacingTokens[2.5]};
      background: ${ColorTokens.neutral.gray[100]};
      color: ${ColorTokens.text.secondary};
      border-radius: ${RadiusTokens.md};
      font-size: 12px;
      font-weight: 500;
      border: 1px solid ${ColorTokens.border.light};
    }
    
    .assignee {
      display: flex;
      align-items: center;
      gap: ${SpacingTokens[2]};
    }
    
    .avatar,
    .avatar-placeholder {
      width: 32px;
      height: 32px;
      border-radius: ${RadiusTokens.full};
      flex-shrink: 0;
    }
    
    .avatar {
      object-fit: cover;
      border: 2px solid ${ColorTokens.border.default};
    }
    
    .avatar-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${ColorTokens.primary[100]};
      color: ${ColorTokens.primary[700]};
      font-weight: 600;
      font-size: 14px;
      border: 2px solid ${ColorTokens.primary[200]};
    }
    
    .assignee-name {
      font-size: 13px;
      font-weight: 500;
      color: ${ColorTokens.text.secondary};
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
