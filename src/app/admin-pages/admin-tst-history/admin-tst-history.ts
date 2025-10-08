import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ เพิ่ม
import { AdminService } from '../../service/admin';
import { AdminNavbar } from "../admin-navbar/admin-navbar";

@Component({
	selector: 'app-admin-tst-history',
	imports: [AdminNavbar, CommonModule, FormsModule], // ✅ เพิ่ม FormsModule
	templateUrl: './admin-tst-history.html',
	styleUrl: './admin-tst-history.scss'
})
export class AdminTstHistory implements OnInit {
	transactions: any[] = [];
	filteredTransactions: any[] = [];
	searchTerm = '';
	selectedType = 'ทั้งหมด';
	loading = true;
	errorMessage = '';

	constructor(private adminService: AdminService) {}

	ngOnInit() {
		this.loadTransactions();
	}

	loadTransactions() {
		this.adminService.getAllTransactions().subscribe({
			next: (res) => {
				if (res.status) {
					this.transactions = res.data;
					this.filteredTransactions = res.data;
				} else {
					this.errorMessage = res.message || 'ไม่สามารถโหลดข้อมูลได้';
				}
				this.loading = false;
			},
			error: (err) => {
				console.error('❌ โหลดประวัติธุรกรรมไม่สำเร็จ:', err);
				this.errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
				this.loading = false;
			}
		});
	}

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch =
        this.searchTerm === '' ||
        t.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (t.email && t.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
        
      const matchesType =
        this.selectedType === 'ทั้งหมด' ||
        (this.selectedType === 'ซื้อเกม' && t.type === 'purchase') ||
        (this.selectedType === 'เติมเงิน' && t.type === 'deposit');
        
      return matchesSearch && matchesType;
    });
  }
  
}
