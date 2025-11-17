import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { TicketsService, Ticket, TicketStatusChange, TriageSuggestion } from '../services/tickets.service';
import { ExternalDataService, ExchangeRateResponse } from '../../../core/services/external-data.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="ticket-detail-container">
      @if (ticketsService.loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (ticket()) {
        <div class="header">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Ticket #{{ ticket()!.id }}</h1>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="editTicket()">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </div>
        </div>

        <div class="content">
          <mat-card class="main-card">
            <mat-card-header>
              <mat-card-title>{{ ticket()!.title }}</mat-card-title>
              <mat-card-subtitle>
                Created {{ ticket()!.created_at | date:'medium' }} by {{ ticket()!.reporter?.name || 'Unknown' }}
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="badges">
                <mat-chip [class]="'priority-' + ticket()!.priority">
                  Priority: {{ ticket()!.priority }}
                </mat-chip>
                <mat-chip [class]="'status-' + ticket()!.status">
                  Status: {{ ticket()!.status | titlecase }}
                </mat-chip>
              </div>

              <mat-divider></mat-divider>

              <div class="description">
                <h3>Description</h3>
                <p>{{ ticket()!.description }}</p>
              </div>

              @if (ticket()!.tags && ticket()!.tags.length > 0) {
                <div class="tags-section">
                  <h3>Tags</h3>
                  <div class="tags">
                    @for (tag of ticket()!.tags; track tag) {
                      <mat-chip>{{ tag }}</mat-chip>
                    }
                  </div>
                </div>
              }

              @if (ticket()!.assignee) {
                <div class="assignee-section">
                  <h3>Assigned To</h3>
                  <div class="assignee">
                    <mat-icon>person</mat-icon>
                    <span>{{ ticket()!.assignee?.name }} ({{ ticket()!.assignee?.email }})</span>
                  </div>
                </div>
              }

              <mat-divider></mat-divider>

              <div class="triage-section">
                <h3>AI Triage Assistant</h3>
                @if (triageLoading()) {
                  <mat-spinner diameter="30"></mat-spinner>
                } @else if (triageSuggestion()) {
                  <div class="triage-suggestion">
                    <p><strong>Summary:</strong> {{ triageSuggestion()!.summary }}</p>
                    <p><strong>Suggested Priority:</strong> {{ triageSuggestion()!.suggested_priority }}</p>
                    <p><strong>Suggested Status:</strong> {{ triageSuggestion()!.suggested_status }}</p>
                    <p><strong>Confidence:</strong> {{ (triageSuggestion()!.confidence * 100).toFixed(0) }}%</p>
                    <div class="triage-actions">
                      <button mat-raised-button color="primary" (click)="acceptTriage()">
                        <mat-icon>check</mat-icon>
                        Accept
                      </button>
                      <button mat-button (click)="rejectTriage()">
                        <mat-icon>close</mat-icon>
                        Reject
                      </button>
                    </div>
                  </div>
                } @else {
                  <button mat-raised-button (click)="requestTriage()">
                    <mat-icon>psychology</mat-icon>
                    Suggest Triage
                  </button>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <div class="sidebar">
            <mat-card class="status-history-card">
              <mat-card-header>
                <mat-card-title>Status History</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (statusChangesLoading()) {
                  <mat-spinner diameter="30"></mat-spinner>
                } @else if (statusChanges().length > 0) {
                  <div class="status-changes">
                    @for (change of statusChanges(); track change.id) {
                      <div class="status-change">
                        <div class="change-header">
                          <mat-icon>update</mat-icon>
                          <span>{{ change.created_at | date:'short' }}</span>
                        </div>
                        <div class="change-detail">
                          @if (change.old_status) {
                            <span>{{ change.old_status }} → </span>
                          }
                          <strong>{{ change.new_status }}</strong>
                        </div>
                        @if (change.user) {
                          <div class="change-user">by {{ change.user.name }}</div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <p>No status changes yet</p>
                }
              </mat-card-content>
            </mat-card>

            <mat-card class="external-data-card">
              <mat-card-header>
                <mat-card-title>Exchange Rates</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (exchangeRatesLoading()) {
                  <mat-spinner diameter="30"></mat-spinner>
                } @else if (exchangeRates()) {
                  <div class="exchange-rates">
                    <p><strong>Base:</strong> {{ exchangeRates()!.base }}</p>
                    <p><strong>Date:</strong> {{ exchangeRates()!.date }}</p>
                    <mat-divider></mat-divider>
                    @for (rate of getRatesArray(); track rate.currency) {
                      <div class="rate-item">
                        <span>{{ rate.currency }}:</span>
                        <strong>{{ rate.value }}</strong>
                      </div>
                    }
                  </div>
                } @else {
                  <button mat-button (click)="loadExchangeRates()">
                    <mat-icon>refresh</mat-icon>
                    Load Rates
                  </button>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ticket-detail-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      h1 {
        flex: 1;
        margin: 0;
      }
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
    }

    .main-card {
      mat-card-header {
        margin-bottom: 16px;
      }
    }

    .badges {
      display: flex;
      gap: 8px;
      margin: 16px 0;
    }

    .priority-low { background-color: #4caf50; color: white; }
    .priority-medium { background-color: #ff9800; color: white; }
    .priority-high { background-color: #f44336; color: white; }

    .status-open { background-color: #2196f3; color: white; }
    .status-in_progress { background-color: #ff9800; color: white; }
    .status-resolved { background-color: #4caf50; color: white; }
    .status-closed { background-color: #9e9e9e; color: white; }

    .description, .tags-section, .assignee-section, .triage-section {
      margin: 24px 0;

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 12px;
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .assignee {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .triage-suggestion {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;

      p {
        margin: 8px 0;
      }
    }

    .triage-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-changes {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-change {
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;

      .change-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .change-user {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
    }

    .exchange-rates {
      .rate-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    @media (max-width: 968px) {
      .content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  statusChanges = signal<TicketStatusChange[]>([]);
  statusChangesLoading = signal(false);
  triageSuggestion = signal<TriageSuggestion | null>(null);
  triageLoading = signal(false);
  externalUser = signal<ExternalUserResponse | null>(null);
  externalUserLoading = signal(false);

  // Computed signal for ticket
  ticket = () => this.ticketsService.currentTicket();

  constructor(
    public ticketsService: TicketsService,
    private externalDataService: ExternalDataService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTicket(id);
      this.loadStatusChanges(id);
      this.loadExternalUser(id);
    }
  }

  loadTicket(id: number): void {
    this.ticketsService.getTicket(id).subscribe({
      error: () => {
        this.snackBar.open('Failed to load ticket', 'Close', { duration: 3000 });
        this.goBack();
      }
    });
  }

  loadStatusChanges(ticketId: number): void {
    this.statusChangesLoading.set(true);
    this.ticketsService.getStatusChanges(ticketId).subscribe({
      next: (response) => {
        this.statusChanges.set(response.data);
        this.statusChangesLoading.set(false);
      },
      error: () => {
        this.statusChangesLoading.set(false);
      }
    });
  }

  requestTriage(): void {
    const ticket = this.ticketsService.currentTicket();
    if (!ticket) return;

    this.triageLoading.set(true);
    this.ticketsService.getTriageSuggestion(ticket.id).subscribe({
      next: (suggestion) => {
        this.triageSuggestion.set(suggestion);
        this.triageLoading.set(false);
      },
      error: (err) => {
        this.triageLoading.set(false);
        this.snackBar.open('Failed to get triage suggestion', 'Close', { duration: 3000 });
      }
    });
  }

  acceptTriage(): void {
    const ticket = this.ticketsService.currentTicket();
    const suggestion = this.triageSuggestion();
    if (!ticket || !suggestion) return;

    this.ticketsService.updateTicket(ticket.id, {
      priority: suggestion.suggested_priority as any,
      status: suggestion.suggested_status as any
    }).subscribe({
      next: () => {
        this.snackBar.open('Triage suggestion applied', 'Close', { duration: 3000 });
        this.triageSuggestion.set(null);
        this.loadStatusChanges(ticket.id);
      },
      error: () => {
        this.snackBar.open('Failed to apply triage', 'Close', { duration: 3000 });
      }
    });
  }

  rejectTriage(): void {
    this.triageSuggestion.set(null);
    this.snackBar.open('Triage suggestion rejected', 'Close', { duration: 2000 });
  }

  loadExternalUser(ticketId: number): void {
    this.externalUserLoading.set(true);
    this.externalDataService.getExternalUser(ticketId).subscribe({
      next: (resp) => {
        this.externalUser.set(resp);
        this.externalUserLoading.set(false);
      },
      error: () => {
        this.externalUserLoading.set(false);
        this.snackBar.open('Failed to load external user', 'Close', { duration: 3000 });
      }
    });
  }

  getExternalUserDisplay(): string {
    const data = this.externalUser();
    if (!data || !data.user) return '';
    const u = data.user;
    return `${u.name} (${u.username}) • ${u.email} • ${u.company}`;
  }

  editTicket(): void {
    const ticket = this.ticketsService.currentTicket();
    if (ticket) {
      this.router.navigate(['/tickets', ticket.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
