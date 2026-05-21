import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Devis } from '../models/devis.model';

@Injectable({ providedIn: 'root' })
export class DevisService {
  private apiUrl = 'https://karess-backend-production-6a64.up.railway.app/api/devis';

  constructor(private http: HttpClient) { }

 saveDevis(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/save`, formData);
}

  downloadDevisPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${id}`, { responseType: 'blob' });
  }
}