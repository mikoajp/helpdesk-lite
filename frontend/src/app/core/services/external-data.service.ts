import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ExternalDataService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExchangeRates(base: string = 'USD', symbols: string[] = ['EUR', 'PLN']): Observable<ExchangeRateResponse> {
    let params = new HttpParams()
      .set('base', base)
      .set('symbols', symbols.join(','));

    return this.http.get<ExchangeRateResponse>(`${this.API_URL}/external-data`, { params });
  }
}
