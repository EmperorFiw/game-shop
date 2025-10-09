import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../service/admin';
import { AdminNavbar } from "../admin-navbar/admin-navbar";

@Component({
	selector: 'app-admin-home',
	standalone: true,
	imports: [CommonModule, AdminNavbar],
	templateUrl: './admin-home.html',
	styleUrls: ['./admin-home.scss']
})
export class AdminHome implements OnInit {
	totalGames = 0;
	totalOrders = 0;
	totalUsers = 0;
	topGames: any[] = [];

	constructor(private adminService: AdminService) {}

	ngOnInit() {
		this.loadDashboard();
	}

	loadDashboard() {
		this.adminService.getDashboardStats().subscribe({
			next: (res) => {
				if (res.status) {
					this.totalGames = res.data.total_games;
					this.totalOrders = res.data.total_orders;
					this.totalUsers = res.data.total_users;
					this.topGames = res.data.top_games;
				}
			},
			error: (err) => {
				console.error(err);
				Swal.fire('เกิดข้อผิดพลาด', 'โหลดข้อมูล Dashboard ไม่สำเร็จ', 'error');
			}
		});
	}
}
