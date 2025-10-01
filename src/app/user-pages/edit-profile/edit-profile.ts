import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  imports: [Navbar,CommonModule,FormsModule,RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
  username: string = 'Username';
  email: string = 'test@test.com';
  balance: number = 100;
  profileImage: string | ArrayBuffer | null = null;

  // ฟังก์ชันอัปโหลดรูป
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profileImage = e.target?.result || null;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
}