import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { AuthService } from '../../service/auth';
import { GameService } from '../../service/game';
import { UserService } from '../../service/user';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule, FormsModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  apiUrl = api.base;
  user: any = null;
  
  showDepositModal: boolean = false;
  depositAmount: number | null = null;

  constructor(private authService: AuthService, private gameService: GameService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
    this.userService.onUserChanged().subscribe(() => {
      this.loadUser();
    });
  }
  
  private loadUser() {
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        this.user = res.user;
      }
    });
  }
  
  
  getProfileImage(path: string): string {
    return `${this.apiUrl}${path}`;
  }

  openDepositModal() {
    this.showDepositModal = true;
  }
  
  closeDepositModal() { 
    this.showDepositModal = false;
  }
  setAmount(amount: number) {
    this.depositAmount = amount;
  }

  confirmDeposit() {
    if (!this.depositAmount || this.depositAmount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกจำนวนเงินที่ถูกต้อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
  
    this.userService.deposit(this.depositAmount).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'เติมเงินสำเร็จ',
          text: `คุณได้เติมเงินจำนวน ${this.depositAmount} บาท`,
          showConfirmButton: false,
          timer: 1500
        });
        this.userService.getUserInfo().subscribe({
          next: (res) => {
            this.user = res.user;
          }
        });
        this.closeDepositModal();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'เติมเงินล้มเหลว',
          text: err.error?.message || 'กรุณาลองใหม่อีกครั้ง'
        });
      }
    });
  }
  

  logout() {
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบแล้ว',
          showConfirmButton: false,
          timer: 1200
        });
      }
    });
  }
  
}
