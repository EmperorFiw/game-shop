import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { GameService } from '../../service/game';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";

@Component({
	selector: 'app-mybasket',
	imports: [Navbar, CommonModule, FormsModule],
	templateUrl: './mybasket.html',
	styleUrl: './mybasket.scss'
})
export class Mybasket implements OnInit {
	basketItems: any[] = [];
	apiUrl: string = api.base;
	discountCode: string = "";
	discountValue: number = 0; // เก็บมูลค่าส่วนลดที่ได้
	validCode: string | null = null; // เก็บชื่อโค้ดที่ใช้สำเร็จ

	constructor(
		private gameService: GameService,
		private userService: UserService,
		private router: Router,
		private location: Location
	) {}

	ngOnInit() {
		this.loadBasket();
	}

	loadBasket() {
		const basket = localStorage.getItem('basket');
		this.basketItems = basket ? JSON.parse(basket) : [];
	}

	removeItemInbasket(id: number) {
		this.basketItems = this.basketItems.filter(item => item.id !== id);
		localStorage.setItem('basket', JSON.stringify(this.basketItems));
	}

	getTotalPrice(): number {
		const total = this.basketItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
		return total - this.discountValue;
	}

	clearBasket() {
		this.basketItems = [];
		localStorage.removeItem('basket');
		this.discountValue = 0;
		this.validCode = null;
		this.discountCode = "";
	}

	// ✅ ฟังก์ชันตรวจสอบโค้ดส่วนลด
	getCodeDiscount() {
		if (!this.discountCode) {
			Swal.fire('แจ้งเตือน', 'กรุณากรอกรหัสส่วนลด', 'warning');
			return;
		}

		Swal.fire({
			title: 'กำลังตรวจสอบโค้ด...',
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			}
		});

		this.gameService.checkDiscountCode(this.discountCode).subscribe({
			next: (res: any) => {
				Swal.close();

				if (res.status) {
					this.discountValue = Number(res.discount);
					this.validCode = this.discountCode;

					Swal.fire({
						icon: 'success',
						title: 'โค้ดถูกต้อง!',
						text: `ส่วนลด ${res.discount} บาทถูกใช้แล้ว`,
						confirmButtonColor: '#28a745',
					});
				} else {
					this.discountValue = 0;
					this.validCode = null;

					Swal.fire({
						icon: 'error',
						title: 'โค้ดไม่ถูกต้อง',
						text: res.message,
						confirmButtonColor: '#d33',
					});
				}
			},
			error: (err) => {
				console.error(err);
				Swal.close();
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด',
					text: 'ไม่สามารถตรวจสอบโค้ดได้',
					confirmButtonColor: '#d33',
				});
			},
		});
	}

  checkout() {
		if (this.basketItems.length === 0) {
			Swal.fire({
				icon: 'info',
				title: 'ไม่มีสินค้าในตะกร้า',
				confirmButtonText: 'ตกลง'
			});
			return;
		}
	
		const total = this.getTotalPrice();
		const ids = this.basketItems.map(i => i.id);
		const code = this.validCode ? this.validCode : null;
	
		Swal.fire({
			title: 'ยืนยันการสั่งซื้อ?',
			html: `
				<b>เกมที่สั่งซื้อ:</b> ${ids.join(', ')}<br>
				<b>โค้ดส่วนลด:</b> ${code ? code : 'ไม่ได้ใช้'}<br>
				<b>ยอดรวมหลังหักส่วนลด:</b> ${total} บาท
			`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'ยืนยันการซื้อ',
			cancelButtonText: 'ยกเลิก',
			confirmButtonColor: '#28a745',
			cancelButtonColor: '#d33'
		}).then(result => {
			if (!result.isConfirmed) return;
	
			Swal.fire({
				title: 'กำลังดำเนินการ...',
				text: 'กรุณารอสักครู่',
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading()
			});
	
			this.gameService.purchaseGame({
				gameIds: ids,
				discountCode: code,
				total: total
			}).subscribe({
				next: (res: any) => {
					Swal.close();
	
					if (res.status) {
						this.clearBasket();
	
						Swal.fire({
							icon: 'success',
							title: 'สั่งซื้อสำเร็จ',
							text: res.message || 'คุณได้สั่งซื้อเกมเรียบร้อยแล้ว',
							confirmButtonColor: '#28a745'
						}).then(() => {
							this.router.navigate(['/history']); // ไปหน้าประวัติการสั่งซื้อ
						});
					} else {
						Swal.fire({
							icon: 'error',
							title: 'ไม่สามารถสั่งซื้อได้',
							text: res.message || 'กรุณาลองใหม่อีกครั้ง',
							confirmButtonColor: '#d33'
						});
					}
				},
				error: (err) => {
					console.error('❌ Purchase Error:', err);
					Swal.close();
					Swal.fire({
						icon: 'error',
						title: 'เกิดข้อผิดพลาด',
						text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
						confirmButtonColor: '#d33'
					});
				}
			});
		});
	}
  
  getOriginalTotalPrice(): number {
    return this.basketItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }
  
	getGameImage(path: string): string {
		return `${this.apiUrl}${path}`;
	}

	goback() {
		this.location.back();
	}
}
