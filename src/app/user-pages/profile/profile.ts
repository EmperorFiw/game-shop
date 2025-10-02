import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { api } from '../../config';
import { UserService } from '../../service/user';
import { Navbar } from "../navbar/navbar";
@Component({
  selector: 'app-profile',
  imports: [Navbar,RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
    apiUrl = api.base;
    user: any = null;
    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      this.loadUser();
      this.userService.onUserChanged().subscribe(() => {
        this.loadUser();
      });
    }
    
    private loadUser() {
      this.userService.getUserInfo().subscribe({
        next: (res) => {
          this.user = res.user;
        }
      });
    }
    getProfileImage(path: string): string {
      return `${this.apiUrl}${path}`;
    }
}
