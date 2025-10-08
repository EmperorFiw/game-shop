import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule,RouterLink ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.scss'
})
export class AdminNavbar {
  showDepositModal: boolean = false;

  constructor(private authService: AuthService) {}

  openDepositModal() {
    this.showDepositModal = true;
  }
  
  closeDepositModal() { 
    this.showDepositModal = false;
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
