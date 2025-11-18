import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TicketsService, Ticket, TicketFilters } from '../services/tickets.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketCardComponent, TicketCardData } from '../../../shared/components/ticket-card.component';
import { ColorTokens, SpacingTokens, RadiusTokens, ShadowTokens } from '../../../shared/design-tokens';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    TicketCardComponent
  ],
  template: `
    <div class="ticket-list-container">
      <div class="header">
        <h1>Tickets</h1>
        <button mat-raised-button color="primary" (click)="createTicket()">
          <mat-icon>add</mat-icon>
          New Ticket
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="filters.status" (selectionChange)="applyFilters()">
            <mat-option [value]="undefined">All</mat-option>
            <mat-option value="open">Open</mat-option>
            <mat-option value="in_progress">In Progress</mat-option>
            <mat-option value="resolved">Resolved</mat-option>
            <mat-option value="closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="filters.priority" (selectionChange)="applyFilters()">
            <mat-option [value]="undefined">All</mat-option>
            <mat-option value="low">Low</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="high">High</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tag</mat-label>
          <input matInput [(ngModel)]="filters.tag" (ngModelChange)="applyFilters()" placeholder="e.g. urgent" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Assignee ID</mat-label>
          <input matInput type="number" [(ngModel)]="filters.assignee" (ngModelChange)="applyFilters()" />
        </mat-form-field>
      </div>

      @if (ticketsService.loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (ticketsService.error()) {
        <div class="error">
          <mat-icon>error</mat-icon>
          <p>{{ ticketsService.error() }}</p>
        </div>
      } @else if (ticketsService.tickets().length === 0) {
        <div class="empty">
          <mat-icon>inbox</mat-icon>
          <p>No tickets found</p>
        </div>
      } @else {
        <div class="tickets-grid">
          @for (ticket of ticketsService.tickets(); track ticket.id) {
            <app-ticket-card 
              [ticket]="toTicketCardData(ticket)"
              [clickable]="true"
              (cardClick)="viewTicket($event)">
            </app-ticket-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .ticket-list-container {
      padding: ${SpacingTokens[8]};
      max-width: 1400px;
      margin: 0 auto;
      background: ${ColorTokens.background.secondary};
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${SpacingTokens[8]};
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: ${ColorTokens.text.primary};
      margin: 0;
    }
    
    .header button {
      padding: ${SpacingTokens[2.5]} ${SpacingTokens[6]};
      background: ${ColorTokens.primary.main};
      color: white;
      border: none;
      border-radius: ${RadiusTokens.md};
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: ${ShadowTokens.sm};
      display: flex;
      align-items: center;
      gap: ${SpacingTokens[2]};
    }
    
    .header button:hover {
      background: ${ColorTokens.primary[700]};
      transform: translateY(-1px);
      box-shadow: ${ShadowTokens.md};
    }

    .filters {
      display: flex;
      gap: ${SpacingTokens[4]};
      margin-bottom: ${SpacingTokens[6]};
      flex-wrap: wrap;
      background: ${ColorTokens.background.paper};
      padding: ${SpacingTokens[6]};
      border-radius: ${RadiusTokens.lg};
      box-shadow: ${ShadowTokens.sm};
      
      mat-form-field {
        min-width: 200px;
        flex: 1;
      }
    }

    .loading, .error, .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${SpacingTokens[16]};
      background: ${ColorTokens.background.paper};
      border-radius: ${RadiusTokens.lg};
      box-shadow: ${ShadowTokens.sm};
      
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: ${SpacingTokens[4]};
        color: ${ColorTokens.neutral.gray[400]};
      }
      
      p {
        color: ${ColorTokens.text.secondary};
        font-size: 16px;
      }
    }
    
    .error mat-icon {
      color: ${ColorTokens.error.main};
    }

    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: ${SpacingTokens[6]};
    }

    @media (max-width: 768px) {
      .ticket-list-container {
        padding: ${SpacingTokens[4]};
      }
      
      .tickets-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
      
      .header {
        flex-direction: column;
        gap: ${SpacingTokens[4]};
        align-items: stretch;
      }
    }
  `]
})
export class TicketListComponent implements OnInit {
  filters: TicketFilters = {};

  constructor(
    public ticketsService: TicketsService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketsService.getTickets(this.filters).subscribe();
  }

  applyFilters(): void {
    this.loadTickets();
  }

  viewTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  createTicket(): void {
    this.router.navigate(['/tickets/new']);
  }
  
  toTicketCardData(ticket: Ticket): TicketCardData {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority as 'low' | 'medium' | 'high' | 'critical',
      status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed',
      tags: ticket.tags,
      assignee: ticket.assignee ? {
        name: ticket.assignee.name,
        email: ticket.assignee.email
      } : undefined,
      created_at: ticket.created_at
    };
  }
}
