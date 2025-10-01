import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
     showDepositModal: boolean = false;

    openDepositModal() {
      this.showDepositModal = true;
    }
    
    closeDepositModal() { 
      this.showDepositModal = false;
    }
}
