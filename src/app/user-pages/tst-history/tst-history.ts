import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { api } from '../../config';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";

@Component({
	selector: 'app-tst-history',
	imports: [Navbar, CommonModule],
	templateUrl: './tst-history.html',
	styleUrl: './tst-history.scss'
})
export class TstHistory implements OnInit {
	transactions: any[] = [];
	loading = true;
	errorMessage = '';
  apiUrl = api.base;

	constructor(private userService: UserService) {}

	ngOnInit() {
		this.loadHistory();
	}

	loadHistory() {
		this.userService.getHistory().subscribe({
			next: (res) => {
				if (res.status) {
					this.transactions = res.data;
				} else {
					this.errorMessage = res.message || 'ไม่สามารถโหลดข้อมูลได้';
				}
				this.loading = false;
			},
			error: (err) => {
				console.error('❌ โหลดประวัติไม่สำเร็จ:', err);
				this.errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
				this.loading = false;
			}
		});
	}

  getGameImage(path: string): string {
		return `${this.apiUrl}${path}`;
	}

}
