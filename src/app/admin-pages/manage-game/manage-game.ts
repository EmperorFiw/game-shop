import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { api } from '../../config';
import { AdminService } from '../../service/admin';
import { AdminNavbar } from "../admin-navbar/admin-navbar";

@Component({
	selector: 'app-manage-game',
	standalone: true,
	imports: [AdminNavbar, CommonModule, FormsModule],
	templateUrl: './manage-game.html',
	styleUrls: ['./manage-game.scss']
})
export class ManageGame implements OnInit {
	showAddGame = false;
	selectedFile: File | null = null;
	previewUrl: string | ArrayBuffer | null = null;
	games: any[] = [];
	editMode = false;
	editId: number | null = null;
  apiUrl = api.base;

	gameData = {
		name: '',
		price: null,
		category: '',
		description: '',
		release_date: ''
	};

	constructor(private adminService: AdminService) {}

	ngOnInit() {
		this.loadGames();
	}

	loadGames() {
		this.adminService.getAllGames().subscribe({
			next: (res) => {
				if (res.status) this.games = res.data;
			},
			error: () => Swal.fire('เกิดข้อผิดพลาด', 'โหลดข้อมูลเกมไม่สำเร็จ', 'error')
		});
	}

	openAddGame() {
		this.showAddGame = true;
		this.editMode = false;
	}

	openEditGame(game: any) {
		this.editMode = true;
		this.editId = game.id;
		this.showAddGame = true;
		this.gameData = { ...game };
		this.previewUrl = this.getGameImage(game.image);
	}
	getGameImage(path: string): string {
		return `${this.apiUrl}${path}`;
	}
	closeAddGame() {
		this.showAddGame = false;
		this.selectedFile = null;
		this.previewUrl = null;
		this.editId = null;
		this.gameData = { name: '', price: null, category: '', description: '', release_date: '' };
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
			const reader = new FileReader();
			reader.onload = () => (this.previewUrl = reader.result);
			reader.readAsDataURL(this.selectedFile);
		}
	}

	saveGame() {
		if (!this.gameData.name || !this.gameData.price || !this.gameData.category) {
			Swal.fire('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลให้ครบทุกช่อง', 'warning');
			return;
		}

		const formData = new FormData();
		for (const [key, value] of Object.entries(this.gameData)) {
			formData.append(key, String(value || ''));
		}
		if (this.selectedFile) formData.append('image', this.selectedFile);

		const request = this.editMode
			? this.adminService.updateGame(this.editId!, formData)
			: this.adminService.addGame(formData);

		request.subscribe({
			next: (res) => {
				if (res.status) {
					Swal.fire('สำเร็จ', res.message, 'success');
					this.loadGames();
					this.closeAddGame();
				} else {
					Swal.fire('ผิดพลาด', res.message, 'error');
				}
			},
			error: () => Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error')
		});
	}

	deleteGame(id: number) {
		Swal.fire({
			title: 'ลบเกมนี้?',
			text: 'หากลบแล้วจะไม่สามารถกู้คืนได้',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'ลบ',
			cancelButtonText: 'ยกเลิก'
		}).then((result) => {
			if (result.isConfirmed) {
				this.adminService.deleteGame(id).subscribe({
					next: (res) => {
						if (res.status) {
							Swal.fire('สำเร็จ', res.message, 'success');
							this.loadGames();
						}
					},
					error: () => Swal.fire('ผิดพลาด', 'ไม่สามารถลบเกมได้', 'error')
				});
			}
		});
	}
}
