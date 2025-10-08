import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

	getHistory(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.get(`${this.apiUrl}/user/history/all`, { headers });
	}

	getGameHistory(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.get(`${this.apiUrl}/user/history/game`, { headers });
	}

  updateProfile(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.put(`${this.apiUrl}/user/update`, data, { headers });
  }
  
	//  ตรวจสอบว่าเป็นแอดมินหรือไม่ 
	isAdmin(): Observable<boolean> {
		const token = this.authService.getToken();
		if (!token) return of(false);

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const role = payload.role;
			return of(role === 'admin');
		} catch {
			return of(false);
		}
	}

	getRole(): string | null {
		const token = this.authService.getToken();
		if (!token) return null;

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.role || null;
		} catch {
			return null;
		}
	}

	notifyUserChanged() {
		this.userChanged$.next(true);
	}

	onUserChanged(): Observable<boolean> {
		return this.userChanged$.asObservable();
	}
}
