import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbar } from "../admin-navbar/admin-navbar";

@Component({
  selector: 'app-discount-code',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar],
  templateUrl: './discount-code.html',
  styleUrls: ['./discount-code.scss']
})
export class DiscountCode {
  isAddModalOpen = false;
  isEditMode = false;

  newCode = {
    code: '',
    amount: 0,  
    date: ''
  };

  // เปิด popup สำหรับเพิ่ม
  openAddCodeModal() {
    this.isAddModalOpen = true;
    this.isEditMode = false;
    this.newCode = { code: '', amount: 0, date: '' };
  }

  
  openEditCodeModal() {
    this.isAddModalOpen = true;
    this.isEditMode = true;
    this.newCode = {
      code: 'WELCOME100',
      amount: 100,
      date: '2025-12-31'
    };
  }

  closeAddCodeModal() {
    this.isAddModalOpen = false;
    this.isEditMode = false;
  }

  saveDiscountCode() {
    if (this.isEditMode) {
      console.log("แก้ไขโค้ด:", this.newCode);
    } else {
      console.log("เพิ่มโค้ดใหม่:", this.newCode);
    }
    this.closeAddCodeModal();
  }
}
