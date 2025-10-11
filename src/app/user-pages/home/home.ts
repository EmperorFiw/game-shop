import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { GameService } from '../../service/game';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterModule, CommonModule, Navbar, FormsModule],
	templateUrl: './home.html',
	styleUrl: './home.scss'
})
export class Home implements OnInit {
	allGames: any[] = []; 
	games: any[] = [];    
	apiUrl = api.base;

	selectedCategory: string = 'ทั้งหมด';
	searchTerm: string = '';

	categories: string[] = [
		'ทั้งหมด', 'FPS', 'RPG', 'Sports', 
		'Action', 'Sandbox', 'MOBA', 
		'Battle Royale', 'Action RPG', 'Horror'
	];

	topGames: any[] = [];
	startDate: string = '';
	endDate: string = '';

	constructor(private gameService: GameService, private userService: UserService) {}

	ngOnInit(): void {
		// โหลดเกมทั้งหมด
		this.gameService.getGames().subscribe({
			next: (res) => {
				this.allGames = res.games;
				this.games = res.games;
			},
			error: (err) => {
				console.error("โหลดเกมไม่สำเร็จ:", err);
			}
		});

		// ตั้งค่า default วันที่เป็นเดือนปัจจุบัน
		const today = new Date();
		this.startDate = new Date(today.getFullYear(), today.getMonth(), 1)
			.toISOString().split("T")[0];
		this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
			.toISOString().split("T")[0];

		this.loadTopGames();
	}

	// โหลด Top 5 Popular ตามช่วงวัน
	loadTopGames() {
		if (!this.startDate || !this.endDate) return;

		this.gameService.getTopGames(this.startDate, this.endDate).subscribe({
			next: (res) => {
				this.topGames = res.games;
			},
			error: (err) => {
				console.error("โหลด Top 5 ไม่สำเร็จ:", err);
			}
		});
	}

	getGameImage(path: string): string {
		return `${this.apiUrl}${path}`;
	}

	// ฟิลเตอร์ตามประเภท
	filterGames(category: string): void {
		this.selectedCategory = category;
		this.applyFilters();
	}

	// ฟิลเตอร์ตามชื่อ
	onSearch(term: string): void {
		this.searchTerm = term;
		this.applyFilters();
	}

	// ฟิลเตอร์รวม category + search
	private applyFilters(): void {
		this.games = this.allGames.filter(game => {
			const matchCategory = this.selectedCategory === 'ทั้งหมด' || game.category?.toLowerCase() === this.selectedCategory.toLowerCase();
			const matchSearch = !this.searchTerm || game.name.toLowerCase().includes(this.searchTerm.toLowerCase());
			return matchCategory && matchSearch;
		});
	}

	// ซื้อเกมพร้อมยืนยัน swal
	confirmPurchase(game: any): void {
		Swal.fire({
			title: 'ยืนยันการซื้อ',
			text: `คุณต้องการซื้อ "${game.name}" จริงหรือไม่?`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'ซื้อเลย',
			cancelButtonText: 'ยกเลิก',
			confirmButtonColor: '#16a34a',
			cancelButtonColor: '#ef4444'
		}).then((result) => {
			if (result.isConfirmed) {
				this.gameService.purchaseById(game.id).subscribe({
					next: (res) => {
						Swal.fire({
							title: 'สำเร็จ!',
							text: `คุณได้ซื้อเกม "${game.name}" สำเร็จ`,
							icon: 'success',
							confirmButtonColor: '#16a34a'
						});
						// แจ้ง Navbar ให้รีโหลด user info
						this.userService.notifyUserChanged();
					},
					error: (err) => {
						Swal.fire({
							title: 'ผิดพลาด!',
							text: err.error?.message || 'ไม่สามารถซื้อเกมได้',
							icon: 'error',
							confirmButtonColor: '#ef4444'
						});
					}
				});
			}
		});
	}

	// ตะกร้าสินค้า
	addToBasket(game: any): void {
		const basket = JSON.parse(localStorage.getItem('basket') || '[]');
		const exists = basket.some((item: any) => item.id === game.id);
		if (!exists) {
			const gametoAdd = {
				...game,
				image: this.getGameImage(game.image)
			}
			basket.push(gametoAdd);
			localStorage.setItem('basket', JSON.stringify(basket));
		}
		Swal.fire({
			title: 'เพิ่มในตะกร้าแล้ว!',
			text: `"${game.name}" ถูกเพิ่มในตะกร้าเรียบร้อย`,
			icon: 'success',
			timer: 1000,
			showConfirmButton: false
		});
	}



  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
  
    // เดือนภาษาไทย
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
    return `${day} ${month} ${year}`;
  }
  
}
