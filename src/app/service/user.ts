import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { api } from '../config';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userChanged$ = new BehaviorSubject<boolean>(false);
  private apiUrl = api.url; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ฟังก์ชันสำหรับเติมเงินให้ user
  deposit(amount: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/user/deposit`, { amount }, { headers });
  }

  // ฟังก์ชันสำหรับดึงข้อมูล user ปัจจุบัน
  getUserInfo(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    return this.http.get(`${this.apiUrl}/user/me`, { headers });
  }

  notifyUserChanged() {
    this.userChanged$.next(true);
  }

  onUserChanged(): Observable<boolean> {
    return this.userChanged$.asObservable();
  }
}
