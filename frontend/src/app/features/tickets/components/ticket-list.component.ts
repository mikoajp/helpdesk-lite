import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TicketsService, Ticket, TicketFilters } from '../services/tickets.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
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
            <mat-card class="ticket-card" (click)="viewTicket(ticket.id)">
              <mat-card-header>
                <mat-card-title>{{ ticket.title }}</mat-card-title>
                <mat-card-subtitle>
                  #{{ ticket.id }} • Created {{ ticket.created_at | date:'short' }}
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <p class="description">{{ ticket.description }}</p>
                
                <div class="badges">
                  <mat-chip [class]="'priority-' + ticket.priority">
                    {{ ticket.priority }}
                  </mat-chip>
                  <mat-chip [class]="'status-' + ticket.status">
                    {{ ticket.status | titlecase }}
                  </mat-chip>
                </div>

                @if (ticket.tags && ticket.tags.length > 0) {
                  <div class="tags">
                    @for (tag of ticket.tags; track tag) {
                      <mat-chip>{{ tag }}</mat-chip>
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
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .ticket-list-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      
      mat-form-field {
        min-width: 200px;
      }
    }

    .loading, .error, .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .ticket-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      }
    }

    .description {
      margin: 16px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .badges {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .priority-low { background-color: #4caf50; color: white; }
    .priority-medium { background-color: #ff9800; color: white; }
    .priority-high { background-color: #f44336; color: white; }

    .status-open { background-color: #2196f3; color: white; }
    .status-in_progress { background-color: #ff9800; color: white; }
    .status-resolved { background-color: #4caf50; color: white; }
    .status-closed { background-color: #9e9e9e; color: white; }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    .assignee {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      color: #666;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 768px) {
      .tickets-grid {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
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
}
