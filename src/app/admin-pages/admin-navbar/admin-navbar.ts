import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule,RouterLink ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.scss'
})
export class AdminNavbar {
     showDepositModal: boolean = false;

    openDepositModal() {
      this.showDepositModal = true;
    }
    
    closeDepositModal() { 
      this.showDepositModal = false;
    }
}
