import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuantityInputDTO } from '../models/quantity.model';

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  private BASE_URL = "http://localhost:8080/api/v1/quantities";

  constructor(private http: HttpClient) {}

  compare(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/compare`, data);
  }

  convert(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/convert`, data);
  }

  add(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/add`, data);
  }

  subtract(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/subtract`, data);
  }

  divide(data: QuantityInputDTO) {
    return this.http.post(`${this.BASE_URL}/divide`, data);
  }

getHistory(operation: string, token: string) {
  console.log("Token:", token);
  return this.http.get(`${this.BASE_URL}/history/operation/${operation}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

  getCount(operation: string) {
    return this.http.get(`${this.BASE_URL}/count/${operation}`);
  }
}