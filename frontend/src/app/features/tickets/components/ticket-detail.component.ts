import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketsService, Ticket, TicketStatusChange } from '../services/tickets.service';
import { TriageSuggestion as ServiceTriageSuggestion } from '../services/tickets.service';
import { ExternalDataService, ExternalUserResponse } from '../../../core/services/external-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge.component';
import { TriageSuggestionPanelComponent, TriageSuggestion } from '../../../shared/components/triage-suggestion-panel.component';
import { ColorTokens, SpacingTokens, RadiusTokens, ShadowTokens, TypographyTokens } from '../../../shared/design-tokens';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PriorityBadgeComponent,
    TriageSuggestionPanelComponent
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
          <div class="main-card">
            <div class="card-header">
              <h2>{{ ticket()!.title }}</h2>
              <p class="meta">
                Created {{ ticket()!.created_at | date:'medium' }} by {{ ticket()!.reporter?.name || 'Unknown' }}
              </p>
            </div>

            <div class="card-content">
              <div class="badges">
                <app-priority-badge [priority]="ticket()!.priority"></app-priority-badge>
                <span class="status-badge status-{{ ticket()!.status }}">
                  {{ formatStatus(ticket()!.status) }}
                </span>
              </div>

              <div class="divider"></div>

              <div class="section">
                <h3>Description</h3>
                <p class="description-text">{{ ticket()!.description }}</p>
              </div>

              @if (ticket()!.tags && ticket()!.tags.length > 0) {
                <div class="section">
                  <h3>Tags</h3>
                  <div class="tags">
                    @for (tag of ticket()!.tags; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              }

              @if (ticket()!.assignee) {
                <div class="section">
                  <h3>Assigned To</h3>
                  <div class="assignee">
                    <div class="avatar-placeholder">
                      {{ getAssigneeInitial() }}
                    </div>
                    <div class="assignee-info">
                      <span class="name">{{ ticket()!.assignee?.name }}</span>
                      <span class="email">{{ ticket()!.assignee?.email }}</span>
                    </div>
                  </div>
                </div>
              }

              <div class="divider"></div>

              <div class="section triage-section">
                <h3>
                  <mat-icon class="section-icon">psychology</mat-icon>
                  AI Triage Assistant
                </h3>
                @if (triageLoading()) {
                  <div class="triage-loading">
                    <mat-spinner diameter="30"></mat-spinner>
                    <p>Analyzing ticket...</p>
                  </div>
                } @else if (triageSuggestion()) {
                  <app-triage-suggestion-panel
                    [suggestion]="convertTriageSuggestion(triageSuggestion()!)"
                    (accept)="acceptTriage()"
                    (reject)="rejectTriage()">
                  </app-triage-suggestion-panel>
                } @else {
                  <button class="triage-button" (click)="requestTriage()">
                    <mat-icon>psychology</mat-icon>
                    Get AI Suggestion
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="sidebar-card">
              <div class="card-header">
                <h3>
                  <mat-icon class="section-icon">history</mat-icon>
                  Status History
                </h3>
              </div>
              <div class="card-content">
                @if (statusChangesLoading()) {
                  <div class="loading-state">
                    <mat-spinner diameter="30"></mat-spinner>
                  </div>
                } @else if (statusChanges().length > 0) {
                  <div class="status-changes">
                    @for (change of statusChanges(); track change.id) {
                      <div class="status-change">
                        <div class="change-header">
                          <mat-icon class="change-icon">update</mat-icon>
                          <span class="change-date">{{ change.created_at | date:'short' }}</span>
                        </div>
                        <div class="change-detail">
                          @if (change.old_status) {
                            <span class="old-status">{{ formatStatus(change.old_status) }}</span>
                            <mat-icon class="arrow-icon">arrow_forward</mat-icon>
                          }
                          <span class="new-status">{{ formatStatus(change.new_status) }}</span>
                        </div>
                        @if (change.user) {
                          <div class="change-user">by {{ change.user.name }}</div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <p class="empty-state">No status changes yet</p>
                }
              </div>
            </div>

            <div class="sidebar-card">
              <div class="card-header">
                <h3>
                  <mat-icon class="section-icon">public</mat-icon>
                  External Profile
                </h3>
              </div>
              <div class="card-content">
                @if (externalUserLoading()) {
                  <div class="loading-state">
                    <mat-spinner diameter="30"></mat-spinner>
                  </div>
                } @else if (externalUser() && externalUser()!.user) {
                  <div class="external-user">
                    <p class="user-name">{{ getExternalUserDisplay() }}</p>
                    <span class="source-badge">JSONPlaceholder</span>
                  </div>
                } @else {
                  <button class="load-button" (click)="loadExternalUser(ticket()!.id)">
                    <mat-icon>refresh</mat-icon>
                    Load Profile
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ticket-detail-container {
      padding: ${SpacingTokens[8]};
      max-width: 1400px;
      margin: 0 auto;
      background: ${ColorTokens.background.secondary};
      min-height: 100vh;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${SpacingTokens[16]};
    }

    .header {
      display: flex;
      align-items: center;
      gap: ${SpacingTokens[4]};
      margin-bottom: ${SpacingTokens[6]};
      background: ${ColorTokens.background.paper};
      padding: ${SpacingTokens[4]} ${SpacingTokens[6]};
      border-radius: ${RadiusTokens.lg};
      box-shadow: ${ShadowTokens.sm};

      h1 {
        flex: 1;
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: ${ColorTokens.text.primary};
        font-family: 'JetBrains Mono', monospace;
      }
      
      button {
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: ${SpacingTokens[6]};
    }

    .main-card, .sidebar-card {
      background: ${ColorTokens.background.paper};
      border-radius: ${RadiusTokens.lg};
      box-shadow: ${ShadowTokens.sm};
      overflow: hidden;
    }
    
    .card-header {
      padding: ${SpacingTokens[6]};
      border-bottom: 1px solid ${ColorTokens.border.default};
      
      h2 {
        margin: 0 0 ${SpacingTokens[2]} 0;
        font-size: 24px;
        font-weight: 700;
        color: ${ColorTokens.text.primary};
        line-height: 1.3;
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: ${ColorTokens.text.primary};
        display: flex;
        align-items: center;
        gap: ${SpacingTokens[2]};
      }
      
      .meta {
        margin: 0;
        font-size: 13px;
        color: ${ColorTokens.text.tertiary};
      }
    }
    
    .card-content {
      padding: ${SpacingTokens[6]};
    }
    
    .section-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: ${ColorTokens.primary.main};
    }

    .badges {
      display: flex;
      gap: ${SpacingTokens[3]};
      margin-bottom: ${SpacingTokens[6]};
      align-items: center;
    }
    
    .status-badge {
      padding: ${SpacingTokens[1.5]} ${SpacingTokens[3]};
      border-radius: ${RadiusTokens.full};
      font-size: 13px;
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
    
    .divider {
      height: 1px;
      background: ${ColorTokens.border.default};
      margin: ${SpacingTokens[6]} 0;
    }
    
    .section {
      margin-bottom: ${SpacingTokens[6]};

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: ${SpacingTokens[3]};
        color: ${ColorTokens.text.primary};
      }
    }

    .description-text {
      margin: 0;
      font-size: 15px;
      color: ${ColorTokens.text.secondary};
      line-height: 1.6;
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
      gap: ${SpacingTokens[3]};
    }
    
    .avatar-placeholder {
      width: 48px;
      height: 48px;
      border-radius: ${RadiusTokens.full};
      background: ${ColorTokens.primary[100]};
      color: ${ColorTokens.primary[700]};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      border: 2px solid ${ColorTokens.primary[200]};
      flex-shrink: 0;
    }
    
    .assignee-info {
      display: flex;
      flex-direction: column;
      gap: ${SpacingTokens[1]};
    }
    
    .assignee-info .name {
      font-size: 14px;
      font-weight: 600;
      color: ${ColorTokens.text.primary};
    }
    
    .assignee-info .email {
      font-size: 13px;
      color: ${ColorTokens.text.tertiary};
    }
    
    .triage-section {
      background: ${ColorTokens.primary[50]};
      padding: ${SpacingTokens[6]};
      border-radius: ${RadiusTokens.lg};
      border: 1px solid ${ColorTokens.primary[100]};
      margin: 0;
    }
    
    .triage-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${SpacingTokens[3]};
      padding: ${SpacingTokens[6]};
    }
    
    .triage-loading p {
      margin: 0;
      color: ${ColorTokens.text.secondary};
      font-size: 14px;
    }
    
    .triage-button {
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
      display: flex;
      align-items: center;
      gap: ${SpacingTokens[2]};
    }
    
    .triage-button:hover {
      background: ${ColorTokens.primary[700]};
      transform: translateY(-1px);
      box-shadow: ${ShadowTokens.md};
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

    .external-user {
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
  statusChanges = signal<TicketStatusChange[]>([]); // status change history
  statusChangesLoading = signal(false);
  triageSuggestion = signal<ServiceTriageSuggestion | null>(null); // latest AI suggestion
  triageLoading = signal(false);
  externalUser = signal<ExternalUserResponse | null>(null); // external profile data
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
  
  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  convertTriageSuggestion(serviceSuggestion: ServiceTriageSuggestion): TriageSuggestion {
    return {
      suggested_priority: serviceSuggestion.suggested_priority as 'low' | 'medium' | 'high',
      suggested_status: serviceSuggestion.suggested_status as 'open' | 'in_progress' | 'resolved' | 'closed',
      summary: serviceSuggestion.summary,
      confidence: serviceSuggestion.confidence
    };
  }
  
  getAssigneeInitial(): string {
    const ticket = this.ticket();
    if (!ticket || !ticket.assignee || !ticket.assignee.name) {
      return '?';
    }
    return ticket.assignee.name.charAt(0).toUpperCase();
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
