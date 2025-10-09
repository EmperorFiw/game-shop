import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from '../config';
import { AuthService } from './auth';

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private apiUrl = api.base;

	constructor(private http: HttpClient, private authService: AuthService) {}

	private getAuthHeaders() {
		return new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
	}

	addGame(formData: FormData): Observable<any> {
		return this.http.post(`${this.apiUrl}/api/admin/add-game`, formData, { headers: this.getAuthHeaders() });
	}

	getAllGames(): Observable<any> {
		return this.http.get(`${this.apiUrl}/api/admin/games`, { headers: this.getAuthHeaders() });
	}

	deleteGame(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/api/admin/delete-game/${id}`, { headers: this.getAuthHeaders() });
	}

	updateGame(id: number, formData: FormData): Observable<any> {
		return this.http.put(`${this.apiUrl}/api/admin/update-game/${id}`, formData, { headers: this.getAuthHeaders() });
	}

	getAllTransactions(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.get(`${this.apiUrl}/api/admin/transactions`, { headers });
	}

	getDiscountCode(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.get(`${this.apiUrl}/api/discount/getAllCode`, { headers });
	}

	addCode(data: any): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.post(`${this.apiUrl}/api/discount/addCode`, data, { headers });
	}
	updateCode(id: number, data: any): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.put(`${this.apiUrl}/api/discount/updateCode/${id}`, data, { headers });
	}
	deleteCode(id: number): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.delete(`${this.apiUrl}/api/discount/deleteCode/${id}`, { headers });
	}
	getDashboardStats(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authService.getToken()}`
		});
		return this.http.get(`${this.apiUrl}/api/admin/dashboard`, { headers });
	}			
}
