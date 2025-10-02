import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const guestGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);

	if (auth.isLogin()) {
		router.navigate(['/home']);
		return false;
	}
	return true;
};

export const authGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);

	if (!auth.isLogin()) {
		router.navigate(['/login']);
		return false;
	}
	return true;
};