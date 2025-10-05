import { Routes } from '@angular/router';
import { Home } from './user-pages/home/home';
import { Login } from './user-pages/login/login';
import { Register } from './user-pages/register/register';

// User
import { EditProfile } from './user-pages/edit-profile/edit-profile';
import { MovieDetails } from './user-pages/movie-details/movie-details';
import { Mybasket } from './user-pages/mybasket/mybasket';
import { Mygame } from './user-pages/mygame/mygame';
import { Profile } from './user-pages/profile/profile';
import { TstHistory } from './user-pages/tst-history/tst-history';

// admin
import { AdminHome } from './admin-pages/admin-home/admin-home';
import { AdminTstHistory } from './admin-pages/admin-tst-history/admin-tst-history';
import { DiscountCode } from './admin-pages/discount-code/discount-code';
import { ManageGame } from './admin-pages/manage-game/manage-game';
import { adminGuard, authGuard, guestGuard } from './service/auth.guard';

export const routes: Routes = [
	{ path: '', component: Login, canActivate: [guestGuard] },
	{ path: 'login', component: Login, canActivate: [guestGuard] },
	{ path: 'register', component: Register, canActivate: [guestGuard] },

    // user
    {path: 'home', component: Home, canActivate: [authGuard]},
    {path: 'movie-details/:id', component: MovieDetails, canActivate: [authGuard] },
    {path: 'mybasket', component: Mybasket, canActivate: [authGuard] },
    {path: 'tst-history', component: TstHistory, canActivate: [authGuard] },
    {path: 'mygame', component: Mygame, canActivate: [authGuard] },
    {path: 'profile', component: Profile, canActivate: [authGuard] },
    {path: 'edit_profile', component: EditProfile, canActivate: [authGuard] },

    // admin
    {path: 'admin-home', component: AdminHome, canActivate: [adminGuard] },
    {path: 'manage-game', component: ManageGame, canActivate: [adminGuard]},
    {path: 'admin-tst-history', component: AdminTstHistory, canActivate: [adminGuard]},
    {path: 'discount-code', component: DiscountCode, canActivate: [adminGuard]}

];
// discount-code