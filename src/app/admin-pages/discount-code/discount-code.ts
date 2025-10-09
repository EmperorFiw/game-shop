import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../service/admin';
import { AdminNavbar } from "../admin-navbar/admin-navbar";

interface Code {
  cid: number,
  code_name: String,
  discount: number,
  count: number,
  expire: Date,
  used: number,
  left: number,
}

@Component({
  selector: 'app-discount-code',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar],
  templateUrl: './discount-code.html',
  styleUrls: ['./discount-code.scss']
})

export class DiscountCode implements OnInit {
  discountCode: Code[] = [];
  isAddModalOpen = false;
  isEditMode = false;
  editingId: number | null = null;

  newCode = {
    code: '',
    amount: 0,
    count: 0,
    date: ''
  };
  

  ngOnInit() {
    this.loadDiscountCode();
  }
  constructor(private adminService: AdminService) {}

  loadDiscountCode() {
    this.adminService.getDiscountCode().subscribe({
      next: (res) => {
        if (res.status) this.discountCode = res.data;
      },
      error: () => Swal.fire('เกิดข้อผิดพลาด', 'โหลดข้อมูลไม่สำเร็จ', 'error')
    });
  }

  openAddCodeModal() {
    this.isAddModalOpen = true;
    this.isEditMode = false;
    this.newCode = {
      code: '',
      amount: 10,
      count: 1, 
      date: ''
    };
  }
  
  openEditCodeModal(code: Code) {
    this.isAddModalOpen = true;
    this.isEditMode = true;
    this.editingId = code.cid;
  
    this.newCode = {
      code: code.code_name as string,
      amount: code.discount,
      count: code.count,
      date: new Date(code.expire).toISOString().split('T')[0]
    };
  }
  

  closeAddCodeModal() {
    this.isAddModalOpen = false;
    this.isEditMode = false;
  }

  saveDiscountCode() {
    if (this.isEditMode) {
      if (!this.editingId) return;
  
      const { code, amount, count, date } = this.newCode;
      if (!code || !amount || !count || !date) {
        Swal.fire('กรอกข้อมูลไม่ครบ', 'กรุณากรอกทุกช่องให้ครบก่อนบันทึก', 'warning');
        return;
      }
  
      this.adminService.updateCode(this.editingId, this.newCode).subscribe({
        next: (res) => {
          if (res.status) {
            Swal.fire('สำเร็จ', res.message, 'success');
            this.loadDiscountCode();
            this.closeAddCodeModal();
          } else {
            Swal.fire('ผิดพลาด', res.message, 'error');
          }
        },
        error: (err) => {
          console.error(err);
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขโค้ดได้', 'error');
        }
      });
    } else {
      const { code, amount, count, date } = this.newCode;
      if (!code || !amount || !count || !date) {
        Swal.fire('กรอกข้อมูลไม่ครบ', 'กรุณากรอกทุกช่องให้ครบก่อนบันทึก', 'warning');
        return;
      }
      if (amount <= 0 || count <= 0) {
        Swal.fire('ข้อมูลไม่ถูกต้อง', 'จำนวนที่ลดและจำนวนที่ใช้ได้ต้องมากกว่า 0', 'warning');
        return;
      }
  
      this.adminService.addCode(this.newCode).subscribe({
        next: (res) => {
          if (res.status) {
            Swal.fire('สำเร็จ', res.message, 'success');
            this.loadDiscountCode();
            this.closeAddCodeModal();
          } else {
            Swal.fire('ผิดพลาด', res.message, 'error');
          }
        },
        error: (err) => {
          console.error(err);
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเพิ่มโค้ดได้', 'error');
        }
      });
    }
  }
  deleteCode(code: Code) {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: `ต้องการลบโค้ดส่วนลด "${code.code_name}" หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCode(code.cid).subscribe({
          next: (res) => {
            if (res.status) {
              Swal.fire('ลบสำเร็จ', res.message, 'success');
              this.loadDiscountCode(); // โหลดใหม่
            } else {
              Swal.fire('ผิดพลาด', res.message, 'error');
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบโค้ดได้', 'error');
          }
        });
      }
    });
  }
  
}
