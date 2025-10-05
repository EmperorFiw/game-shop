import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// ฟังก์ชันช่วยตรวจสอบว่า token หมดอายุหรือไม่
function isTokenExpired(token: string): boolean {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const now = Math.floor(Date.now() / 1000);
		return payload.exp && payload.exp < now; // ถ้า exp < ปัจจุบัน = หมดอายุ
	} catch {
		return true; // ถ้าถอดไม่ได้ ถือว่าหมดอายุ
	}
}

// ----------------------------
// Guest Guard (สำหรับคนที่ยังไม่ล็อกอินเท่านั้น)
// ----------------------------
export const guestGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);

	if (auth.isLogin()) {
		router.navigate(['/home']);
		return false;
	}
	return true;
};

// ----------------------------
// Auth Guard (สำหรับหน้าที่ต้องล็อกอินก่อนเข้า)
// ----------------------------
export const authGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);
	const token = auth.getToken();

	if (!token || isTokenExpired(token)) {
		auth.logout();
		return false;
	}

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const role = payload.role;
		console.log(role);

		if (role === 'admin') {
			router.navigate(['/admin-home']);
			return false;
		}

		return true;
	} catch (err) {
		auth.logout();
		return false;
	}
};

// ----------------------------
// Admin Guard (เฉพาะแอดมินเท่านั้น)
// ----------------------------
export const adminGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);
	const token = auth.getToken();

	if (!token || isTokenExpired(token)) {
		auth.logout();
		return false;
	}

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const role = payload.role;

		if (role !== 'admin') {
			router.navigate(['/home']);
			return false;
		}

		return true;
	} catch {
		auth.logout();
		return false;
	}
};
