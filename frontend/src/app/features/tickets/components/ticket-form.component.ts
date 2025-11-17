import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { TicketsService } from '../services/tickets.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="ticket-form-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode ? 'Edit Ticket' : 'Create Ticket' }}</h1>
      </div>

      @if (loading()) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-card>
          <mat-card-content>
            <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput formControlName="title" required>
                @if (ticketForm.get('title')?.hasError('required') && ticketForm.get('title')?.touched) {
                  <mat-error>Title is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea 
                  matInput 
                  formControlName="description" 
                  rows="6"
                  required>
                </textarea>
                @if (ticketForm.get('description')?.hasError('required') && ticketForm.get('description')?.touched) {
                  <mat-error>Description is required</mat-error>
                }
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Priority</mat-label>
                  <mat-select formControlName="priority" required>
                    <mat-option value="low">Low</mat-option>
                    <mat-option value="medium">Medium</mat-option>
                    <mat-option value="high">High</mat-option>
                  </mat-select>
                  @if (ticketForm.get('priority')?.hasError('required') && ticketForm.get('priority')?.touched) {
                    <mat-error>Priority is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="status" required>
                    <mat-option value="open">Open</mat-option>
                    <mat-option value="in_progress">In Progress</mat-option>
                    <mat-option value="resolved">Resolved</mat-option>
                    <mat-option value="closed">Closed</mat-option>
                  </mat-select>
                  @if (ticketForm.get('status')?.hasError('required') && ticketForm.get('status')?.touched) {
                    <mat-error>Status is required</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Assignee ID (optional)</mat-label>
                <input matInput type="number" formControlName="assignee_id">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tags</mat-label>
                <mat-chip-grid #chipGrid>
                  @for (tag of tags(); track tag) {
                    <mat-chip-row (removed)="removeTag(tag)">
                      {{ tag }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip-row>
                  }
                </mat-chip-grid>
                <input
                  placeholder="Add tag..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  (matChipInputTokenEnd)="addTag($event)"
                />
              </mat-form-field>

              <div class="form-actions">
                <button mat-button type="button" (click)="goBack()">
                  Cancel
                </button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit"
                  [disabled]="ticketForm.invalid || submitting()">
                  @if (submitting()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    {{ isEditMode ? 'Update' : 'Create' }}
                  }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .ticket-form-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      h1 {
        margin: 0;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    mat-spinner {
      display: inline-block;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  tags = signal<string[]>([]);
  loading = signal(false);
  submitting = signal(false);
  isEditMode = false;
  ticketId?: number;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private ticketsService: TicketsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['open', Validators.required],
      assignee_id: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.ticketId = Number(id);
      this.loadTicket(this.ticketId);
    }
  }

  loadTicket(id: number): void {
    this.loading.set(true);
    this.ticketsService.getTicket(id).subscribe({
      next: (resp) => {
        const ticket: any = (resp as any)?.data ?? resp;
        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          assignee_id: ticket.assignee_id ?? null
        });
        const raw = Array.isArray(ticket.tags) ? ticket.tags : (typeof ticket.tags === 'string' ? ticket.tags.split(',') : []);
        const norm = Array.from(new Set((raw || []).map((x: any) => typeof x === 'string' ? x.trim() : (x?.name ?? String(x))).filter(Boolean)));
        this.tags.set(norm);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open('Failed to load ticket', 'Close', { duration: 3000 });
        this.goBack();
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = (event.value || '').trim();
    if (!input) { event.chipInput!.clear(); return; }
    const parts = input.split(',').map(p => p.trim()).filter(Boolean);
    this.tags.update(tags => Array.from(new Set([...tags, ...parts])));
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.submitting.set(true);
      const formValue = {
        ...this.ticketForm.value,
        tags: this.tags()
      };

      const request = this.isEditMode && this.ticketId
        ? this.ticketsService.updateTicket(this.ticketId, formValue)
        : this.ticketsService.createTicket(formValue);

      request.subscribe({
        next: (ticket) => {
          this.snackBar.open(
            `Ticket ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/tickets', ticket.id]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.snackBar.open(
            err.error?.message || 'Failed to save ticket',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode && this.ticketId) {
      this.router.navigate(['/tickets', this.ticketId]);
    } else {
      this.router.navigate(['/tickets']);
    }
  }
}
