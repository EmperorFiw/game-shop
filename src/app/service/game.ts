import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from '../config';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ดึงข้อมูลเกมทั้งหมด
  getGames(): Observable<any> {
    return this.http.get(`${api.url}/game`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    });
  }

  // ดึงรายละเอียดเกมตาม id
  getGameById(id: number): Observable<any> {
    return this.http.get(`${api.url}/game/${id}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    });
  }
  
  getTopGames(start: string, end: string): Observable<any> {
    return this.http.get(`${api.url}/game/top?start=${start}&end=${end}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    });
  }
  // ซื้อเกมตาม id
  purchaseById(gameId: number): Observable<any> {
    return this.http.post(`${api.url}/game/purchase`, { gameId }, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    });
  }

}
