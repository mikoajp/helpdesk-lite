import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExternalUserResponse {
  success: boolean;
  ticket_id: number;
  user?: {
    id: number;
    name: string | null;
    username: string | null;
    email: string | null;
    company: string | null;
    source: string;
  };
  error?: { code: string; message: string; details?: string };
}

@Injectable({
  providedIn: 'root'
})
export class ExternalDataService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExternalUser(ticketId: number): Observable<ExternalUserResponse> {
    return this.http.get<ExternalUserResponse>(`${this.API_URL}/tickets/${ticketId}/external-user`);
  }
}
