import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
	constructor(private authService: AuthService, private router: Router) {}

	email: string = "";
	password: string = "";

	login() {
		if (!this.email || !this.password) {
			Swal.fire({
				icon: 'error',
				title: 'กรอกข้อมูลให้ครบถ้วน',
				showConfirmButton: true
			});
			return;
		}

		this.authService.login({ email: this.email, password: this.password }).subscribe({
			next: (res: any) => {
				if (res.status) {
					if (res.token) {
						this.authService.setToken(res.token);
					}

					Swal.fire({
						icon: 'success',
						title: res.message || 'เข้าสู่ระบบสำเร็จ',
						showConfirmButton: false,
						timer: 1200
					});

					this.router.navigate(['/home']);
				} else {
					Swal.fire({
						icon: 'error',
						title: res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
						showConfirmButton: true
					});
				}
			},
			error: (err) => {
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด',
					text: err.error?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
				});
			}
		});
	}

}