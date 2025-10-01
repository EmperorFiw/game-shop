import { Component } from '@angular/core';
import { AdminNavbar } from "../admin-navbar/admin-navbar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-game',
  standalone: true,
  imports: [AdminNavbar, CommonModule],
  templateUrl: './manage-game.html',
  styleUrls: ['./manage-game.scss']
})
export class ManageGame {
  showAddGame = false; // state popup
  selectedFile: File | null = null; // เก็บไฟล์ที่เลือก
  previewUrl: string | ArrayBuffer | null = null; // สำหรับ preview

  openAddGame() {
    this.showAddGame = true;
  }

  closeAddGame() {
    this.showAddGame = false;
    this.selectedFile = null;
    this.previewUrl = null; // เคลียร์ preview
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // กำหนด preview
      };
      reader.readAsDataURL(this.selectedFile); // อ่านไฟล์เป็น URL
    }
  }
}
