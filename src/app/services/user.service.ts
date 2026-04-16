import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = 'https://quantitymeasurementapp-2-gz4h.onrender.com/api/v1/users';

  constructor(private http: HttpClient) {}

  register(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, dto);
  }

  login(dto: LoginDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, dto);
  }

  check(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/check`);
  }
}