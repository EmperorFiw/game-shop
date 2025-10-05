import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth';

@Component({
	selector: 'app-register',
	templateUrl: './register.html',
	styleUrls: ['./register.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule],
})
export class Register {
	constructor(private authService: AuthService, private router: Router) {}

	profileImage: string | ArrayBuffer | null = null;
	username: string = "";
	email: string = "";
	password: string = "";
	file: File | null = null;

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			this.file = input.files[0];

			const reader = new FileReader();
			reader.onload = () => {
				this.profileImage = reader.result;
			};
			reader.readAsDataURL(this.file);
		}
	}

	Register() {
		if (!this.username || !this.email || !this.password) {
			Swal.fire({
				icon: 'error',
				title: "กรอกข้อมูลให้ครบถ้วน!",
				showConfirmButton: true
			});
			return;
		}

		const formData = new FormData();
		formData.append("username", this.username);
		formData.append("email", this.email);
		formData.append("password", this.password);

		if (this.file) {
			formData.append("profileImage", this.file);
		}

		this.authService.register(formData).subscribe({
			next: (res: any) => {
				if (res.status) {
					if (res.token) {
						this.authService.setToken(res.token);
					}
					Swal.fire({
						icon: 'success',
						title: res.message,
						showConfirmButton: true
					}).then(() => {
						this.router.navigate(['/home']);
					});
				} else {
					Swal.fire({
						icon: 'error',
						title: res.message,
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
