import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { GameService } from '../../service/game';
import { UserService } from '../../service/user';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss'
})
export class MovieDetails implements OnInit {
  game: any = null;
  apiUrl = api.base;

  constructor(
    public location: Location, 
    private route: ActivatedRoute,
    private gameService: GameService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gameService.getGameById(+id).subscribe({
        next: (res) => {
          this.game = res.game;
        },
        error: (err) => {
          console.error('โหลดรายละเอียดเกมไม่สำเร็จ:', err);
        }
      });
    }
  }
  getGameImage(path: string): string {
    return `${this.apiUrl}${path}`;
  }
  confirmPurchase(): void {
    Swal.fire({
      title: 'ยืนยันการซื้อ',
      text: `คุณต้องการซื้อ "${this.game.name}" จริงหรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ซื้อเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameService.purchaseById(this.game.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'สำเร็จ!',
              text: `คุณได้ซื้อเกม "${this.game.name}" สำเร็จ`,
              icon: 'success',
              confirmButtonColor: '#16a34a'
            });
            this.userService.notifyUserChanged(); // อัปเดต navbar
          },
          error: (err) => {
            Swal.fire({
              title: 'ผิดพลาด!',
              text: err.error?.message || 'ไม่สามารถซื้อเกมได้',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }
}
