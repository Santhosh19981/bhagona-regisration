import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  get baseUrl(): string {
    if (typeof window !== 'undefined' && window.location) {
      const host = (window.location.hostname || '').toLowerCase();
      if (host === 'registration.bhagona.in' || host === 'bhagona.in') {
        return 'https://api.bhagona.in';
      }
      if (host === 'localhost' || host === '127.0.0.1' || host.includes('qa')) {
        return 'https://qa-api.bhagona.in';
      }
    }
    return environment.apiUrl || 'https://qa-api.bhagona.in';
  }

  constructor(private http: HttpClient) { }

  addUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addUser`, data);
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services`);
  }
}