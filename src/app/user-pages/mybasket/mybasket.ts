import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { GameService } from '../../service/game';
import { UserService } from '../../service/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mybasket',
  imports: [Navbar, CommonModule],
  templateUrl: './mybasket.html',
  styleUrl: './mybasket.scss'
})
export class Mybasket implements OnInit {
  basketItems: any[] = [];

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
    return this.basketItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }

  clearBasket() {
    this.basketItems = [];
    localStorage.removeItem('basket');
  }

  // ฟังก์ชันชำระเงิน
  checkout() {
  if (this.basketItems.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'ไม่มีสินค้าในตะกร้า',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    });
    return;
  }

  let successCount = 0;
  const totalItems = this.basketItems.length;

  //ถ้าซื้อเกมมากกว่า 1
  if (totalItems > 1) {
    Swal.fire({
      icon: 'info',
      title: 'ซื้อเกมทีละเกม', 
      text: 'ซื้อได้แค่ที่ละ 1 เกม ไปลบบบบบบบบบบบบบบ',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    });
  }else{
    Swal.fire({
    title: 'ยืนยันการซื้อ?',
    text: `คุณต้องการซื้อ ${totalItems} เกม รวม ${this.getTotalPrice()} บาทใช่ไหม?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      this.basketItems.forEach((item) => {
        this.gameService.purchaseById(item.id).subscribe({
          next: () => {
            successCount++;
            if (successCount === totalItems) {
              Swal.fire({
                icon: 'success',
                title: 'ซื้อเกมสำเร็จแล้ว!',
                showConfirmButton: false,
                timer: 1500
              });
              this.clearBasket();
              this.router.navigate(['/home  ']);
            }
          },
          error: (err) => {
            console.error('ซื้อเกมล้มเหลว', err);
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาดในการซื้อเกม',
              text: 'โปรดลองอีกครั้ง',
              confirmButtonColor: '#d33'
            });
          }
        });
      });
    }
  });
  }


}

  goback() { 
    this.location.back();
  }
}
