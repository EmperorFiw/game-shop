import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from '../config';

@Injectable({providedIn: 'root'})
  export class AuthService {
    private tokenKey = 'auth_token';
  
    constructor(private http: HttpClient) {}
  
    register(formData: FormData): Observable<any> {
      return this.http.post(`${api.url}/auth/register`, formData);
    }
  
    login(data: { email: string; password: string; }): Observable<any> {
      return this.http.post(`${api.url}/auth/login`, data);
    }
  
    setToken(token: string): void {
      localStorage.setItem(this.tokenKey, token);
    }
  
    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }
  
    clearToken(): void {
      localStorage.removeItem(this.tokenKey);
    }
  
    isLogin(): boolean {
      return !!this.getToken();
    }

    logout(): void {
      this.clearToken();
      window.location.href = '/login';
    }
    
  }
  