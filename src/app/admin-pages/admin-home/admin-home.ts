import { Component } from '@angular/core';

import { AdminNavbar } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [AdminNavbar],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.scss'
})
export class AdminHome {

}
