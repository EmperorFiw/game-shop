import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { api } from '../../config';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";

@Component({
	selector: 'app-mygame',
	imports: [Navbar, CommonModule, RouterModule],
	templateUrl: './mygame.html',
	styleUrl: './mygame.scss'
})
export class Mygame implements OnInit {
	games: any[] = [];
	loading = true;
	errorMessage = '';
  apiUrl = api.base;

	constructor(private userService: UserService) {}

	ngOnInit() {
		this.loadGames();
	}

	loadGames() {
		this.userService.getGameHistory().subscribe({
			next: (res) => {
				if (res.status) {
					this.games = res.data;
				} else {
					this.errorMessage = res.message || 'ไม่สามารถโหลดข้อมูลเกมได้';
				}
				this.loading = false;
			},
			error: (err) => {
				console.error('❌ โหลดข้อมูลเกมไม่สำเร็จ:', err);
				this.errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
				this.loading = false;
			}
		});
	}

  getGameImage(path: string): string {
		return `${this.apiUrl}${path}`;
	}
}
