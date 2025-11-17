import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PriorityBadgeComponent } from './priority-badge.component';

export interface TriageSuggestion {
  suggested_priority: 'low' | 'medium' | 'high';
  suggested_status: 'open' | 'in_progress' | 'resolved' | 'closed';
  summary: string;
  confidence: number;
}

@Component({
  selector: 'app-triage-suggestion-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PriorityBadgeComponent
  ],
  template: `
    <mat-card class="triage-panel" [class.loading]="loading" [class.error]="error">
      <mat-card-header>
        <mat-icon mat-card-avatar>psychology</mat-icon>
        <mat-card-title>AI Triage Assistant</mat-card-title>
        <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        @if (loading) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Analyzing ticket...</p>
          </div>
        } @else if (error) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <p class="error-message">{{ errorMessage }}</p>
            <button mat-button color="primary" (click)="onRetry()">
              <mat-icon>refresh</mat-icon>
              Retry
            </button>
          </div>
        } @else if (suggestion) {
          <div class="suggestion-content">
            <div class="summary">
              <mat-icon>article</mat-icon>
              <p>{{ suggestion.summary }}</p>
            </div>

            <div class="suggestions">
              <div class="suggestion-item">
                <label>Suggested Priority:</label>
                <app-priority-badge [priority]="suggestion.suggested_priority"></app-priority-badge>
              </div>

              <div class="suggestion-item">
                <label>Suggested Status:</label>
                <span class="status-badge" [class]="'status-' + suggestion.suggested_status">
                  {{ formatStatus(suggestion.suggested_status) }}
                </span>
              </div>

              <div class="suggestion-item confidence">
                <label>Confidence:</label>
                <div class="confidence-bar">
                  <div 
                    class="confidence-fill" 
                    [style.width.%]="suggestion.confidence * 100"
                    [class.high]="suggestion.confidence >= 0.8"
                    [class.medium]="suggestion.confidence >= 0.5 && suggestion.confidence < 0.8"
                    [class.low]="suggestion.confidence < 0.5">
                  </div>
                </div>
                <span class="confidence-value">{{ (suggestion.confidence * 100).toFixed(0) }}%</span>
              </div>
            </div>

            <div class="actions">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="onAccept()"
                [disabled]="disabled">
                <mat-icon>check</mat-icon>
                Accept Suggestion
              </button>
              <button 
                mat-button 
                (click)="onReject()"
                [disabled]="disabled">
                <mat-icon>close</mat-icon>
                Reject
              </button>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon>lightbulb_outline</mat-icon>
            <p>Click the button below to get AI-powered suggestions for this ticket.</p>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="onRequestSuggestion()"
              [disabled]="disabled">
              <mat-icon>psychology</mat-icon>
              Get Suggestion
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .triage-panel {
      mat-card-header {
        margin-bottom: 16px;
        
        mat-icon[mat-card-avatar] {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: #3f51b5;
        }
      }
    }

    .loading-state, .error-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      text-align: center;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
      
      p {
        margin: 0 0 16px 0;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .loading-state mat-icon {
      color: #3f51b5;
    }

    .error-state mat-icon {
      color: #f44336;
    }

    .empty-state mat-icon {
      color: #ff9800;
    }

    .suggestion-content {
      .summary {
        display: flex;
        gap: 12px;
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-bottom: 24px;
        
        mat-icon {
          color: #3f51b5;
          flex-shrink: 0;
        }
        
        p {
          margin: 0;
          line-height: 1.6;
        }
      }

      .suggestions {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }

      .suggestion-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        label {
          font-weight: 500;
          min-width: 140px;
          color: rgba(0, 0, 0, 0.6);
        }

        &.confidence {
          flex-wrap: wrap;
        }
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        
        &.status-open { background-color: #2196f3; color: white; }
        &.status-in_progress { background-color: #ff9800; color: white; }
        &.status-resolved { background-color: #4caf50; color: white; }
        &.status-closed { background-color: #9e9e9e; color: white; }
      }

      .confidence-bar {
        flex: 1;
        height: 8px;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        min-width: 100px;
      }

      .confidence-fill {
        height: 100%;
        transition: width 0.3s ease-in-out;
        
        &.high { background-color: #4caf50; }
        &.medium { background-color: #ff9800; }
        &.low { background-color: #f44336; }
      }

      .confidence-value {
        font-weight: 500;
        min-width: 40px;
        text-align: right;
      }

      .actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }
    }

    @media (max-width: 600px) {
      .suggestion-item {
        flex-direction: column;
        align-items: flex-start;
        
        label {
          min-width: auto;
        }
      }

      .actions {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class TriageSuggestionPanelComponent {
  @Input() suggestion: TriageSuggestion | null = null;
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = 'Failed to get suggestion. Please try again.';
  @Input() disabled: boolean = false;
  @Input() subtitle: string = 'Powered by AI';
  
  @Output() accept = new EventEmitter<TriageSuggestion>();
  @Output() reject = new EventEmitter<void>();
  @Output() requestSuggestion = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  onAccept(): void {
    if (this.suggestion && !this.disabled) {
      this.accept.emit(this.suggestion);
    }
  }

  onReject(): void {
    if (!this.disabled) {
      this.reject.emit();
    }
  }

  onRequestSuggestion(): void {
    if (!this.disabled) {
      this.requestSuggestion.emit();
    }
  }

  onRetry(): void {
    this.retry.emit();
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
