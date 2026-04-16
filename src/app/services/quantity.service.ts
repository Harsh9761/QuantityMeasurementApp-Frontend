import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuantityInputDTO } from '../models/quantity.model';

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  private BASE_URL = "https://quantitymeasurementapp-2-gz4h.onrender.com/api/v1/quantities";

  constructor(private http: HttpClient) {}

  //  helper to get token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // adjust if you store elsewhere

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  compare(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/compare`, data, {
      headers: this.getAuthHeaders()
    });
  }

  convert(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/convert`, data, {
      headers: this.getAuthHeaders()
    });
  }

  add(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/add`, data, {
      headers: this.getAuthHeaders()
    });
  }

  subtract(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/subtract`, data, {
      headers: this.getAuthHeaders()
    });
  }

  divide(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/divide`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getHistory(operation: string, token: string) {
  return this.http.get(`${this.BASE_URL}/history/operation/${operation}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

  getCount(operation: string) {
    return this.http.get(`${this.BASE_URL}/count/${operation}`);
  }
}