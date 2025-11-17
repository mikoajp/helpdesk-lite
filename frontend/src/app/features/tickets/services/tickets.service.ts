import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee_id?: number;
  reporter_id: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  reporter?: {
    id: number;
    name: string;
    email: string;
  };
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TicketStatusChange {
  id: number;
  ticket_id: number;
  user_id: number;
  old_status: string | null;
  new_status: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface TriageSuggestion {
  suggested_priority: string;
  suggested_status: string;
  summary: string;
  confidence: number;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  assignee?: number;
  tag?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private readonly API_URL = environment.apiUrl;
  
  // State management with signals
  tickets = signal<Ticket[]>([]);
  currentTicket = signal<Ticket | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getTickets(filters?: TicketFilters): Observable<{ data: Ticket[] }> {
    this.loading.set(true);
    this.error.set(null);
    
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.assignee) params = params.set('assignee_id', filters.assignee.toString());
      if (filters.tag) params = params.set('tag', filters.tag);
    }

    return this.http.get<{ data: Ticket[] }>(`${this.API_URL}/tickets`, { params })
      .pipe(
        map((response) => {
          const mapped = (response.data || []).map((t: any) => {
            const raw = Array.isArray(t?.tags) ? t.tags : (typeof t?.tags === 'string' ? t.tags.split(',') : []);
            const norm = Array.from(new Set((raw || []).map((x: any) => typeof x === 'string' ? x.trim() : (x?.name ?? String(x))).filter(Boolean)));
            return { ...t, tags: norm } as Ticket;
          });
          return { data: mapped } as { data: Ticket[] };
        }),
        tap({
          next: (response) => {
            this.tickets.set(response.data);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        })
      );
  }

  getTicket(id: number): Observable<Ticket> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<any>(`${this.API_URL}/tickets/${id}`)
      .pipe(
        map((resp) => {
          const t = (resp?.data ?? resp) as any;
          const raw = Array.isArray(t?.tags) ? t.tags : (typeof t?.tags === 'string' ? t.tags.split(',') : []);
          const norm = Array.from(new Set((raw || []).map((x: any) => typeof x === 'string' ? x.trim() : (x?.name ?? String(x))).filter(Boolean))) as string[];
          return { ...t, tags: norm } as Ticket;
        }),
        tap({
          next: (ticket) => {
            this.currentTicket.set(ticket);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        })
      );
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Ticket>(`${this.API_URL}/tickets`, ticket)
      .pipe(
        tap({
          next: () => {
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        })
      );
  }

  updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Ticket>(`${this.API_URL}/tickets/${id}`, ticket)
      .pipe(
        tap({
          next: (updatedTicket) => {
            this.currentTicket.set(updatedTicket);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        })
      );
  }

  deleteTicket(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${this.API_URL}/tickets/${id}`)
      .pipe(
        tap({
          next: () => {
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        })
      );
  }

  getStatusChanges(ticketId: number): Observable<{ data: TicketStatusChange[] }> {
    return this.http.get<{ data: TicketStatusChange[] }>(`${this.API_URL}/tickets/${ticketId}/status-changes`);
  }

  getTriageSuggestion(ticketId: number): Observable<TriageSuggestion> {
    return this.http.post<TriageSuggestion>(`${this.API_URL}/tickets/${ticketId}/triage-suggest`, {});
  }
}
