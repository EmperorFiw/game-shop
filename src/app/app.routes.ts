import { Routes } from '@angular/router';
import { Home } from './user-pages/home/home';
import { Login } from './user-pages/login/login';
import { Register } from './user-pages/register/register';

// User
import { MovieDetails } from './user-pages/movie-details/movie-details';
import { Mybasket } from './user-pages/mybasket/mybasket';
import { TstHistory } from './user-pages/tst-history/tst-history';
import { Mygame } from './user-pages/mygame/mygame';
import { Profile } from './user-pages/profile/profile';
import {EditProfile } from './user-pages/edit-profile/edit-profile';

// admin
import { AdminHome } from './admin-pages/admin-home/admin-home';
import {ManageGame} from   './admin-pages/manage-game/manage-game';
import { AdminTstHistory } from './admin-pages/admin-tst-history/admin-tst-history';
import { DiscountCode } from './admin-pages/discount-code/discount-code';
export const routes: Routes = [
    {path: '', component: Login },
    {path: 'register', component: Register },

    // user
    {path: 'home', component: Home },
    {path: 'movie-details', component: MovieDetails },
    {path: 'mybasket', component: Mybasket},
    {path: 'tst-history', component: TstHistory},
    {path: 'mygame', component: Mygame},
    {path: 'profile', component: Profile},
    {path: 'edit_profile', component: EditProfile},

    // admin
    {path: 'admin-home', component: AdminHome},
    {path: 'manage-game', component: ManageGame},
    {path: 'admin-tst-history', component: AdminTstHistory},
    {path: 'discount-code', component: DiscountCode}

];
// discount-code