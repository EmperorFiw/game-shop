import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";

@Component({
	selector: 'app-edit-profile',
	imports: [Navbar, CommonModule, FormsModule, RouterLink],
	templateUrl: './edit-profile.html',
	styleUrl: './edit-profile.scss'
})
export class EditProfile {
	user: any = {}; //  ป้องกัน undefined
	username: string = '';
	email: string = '';
	balance: number = 0;
	profileImage: string | ArrayBuffer | null = null;
	selectedFile: File | null = null;
  apiUrl = api.base;

	constructor(
		private userService: UserService,
		private router: Router
	) {}

	ngOnInit() {
		this.userService.getUserInfo().subscribe({
			next: (res) => {
				const user = res.user;
				if (!user) {
					Swal.fire('ผิดพลาด', 'ไม่พบข้อมูลผู้ใช้', 'error');
					return;
				}

				this.user = user;
				this.username = user.username;
				this.email = user.email;
				this.balance = user.money || 0;
				this.profileImage = user.avatar || null;
			},
			error: () =>
				Swal.fire('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้', 'error')
		});
	}

	//  ฟังก์ชันอัปโหลดรูป
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			this.selectedFile = input.files[0];

			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				this.profileImage = e.target?.result || null;
			};
			reader.readAsDataURL(this.selectedFile);
		}
	}
  getProfileImage(path?: string | null): string {
    if (!path) return 'assets/default.jpg';
    if (path.startsWith('http')) return path; // กันกรณีเป็น URL เต็ม
    return `${this.apiUrl}${path}`;
  }
  
	//  ฟังก์ชันบันทึกโปรไฟล์
	saveProfile(): void {
		const formData = new FormData();
		formData.append("username", this.username);
		formData.append("email", this.email);
		formData.append("balance", this.balance.toString());
		if (this.selectedFile) formData.append("avatar", this.selectedFile);

		this.userService.updateProfile(formData).subscribe({
			next: () => {
				Swal.fire('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว', 'success');
				this.userService.notifyUserChanged();
				this.router.navigate(['/profile']);
			},
			error: () =>
				Swal.fire('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
		});
	}
}
