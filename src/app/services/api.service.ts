import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addUser`, data);
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services`);
  }
}