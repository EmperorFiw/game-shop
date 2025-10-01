import { Routes } from '@angular/router';
import { Home } from './user-pages/home/home';
import { Login } from './user-pages/login/login';
import { Register } from './user-pages/register/register';

import { MovieDetails } from './user-pages/movie-details/movie-details';
import { Mybasket } from './user-pages/mybasket/mybasket';
import { TstHistory } from './user-pages/tst-history/tst-history';
import { Mygame } from './user-pages/mygame/mygame';


export const routes: Routes = [
    {path: '', component: Login },
    {path: 'register', component: Register },
    {path: 'home', component: Home },
    {path: 'movie-details', component: MovieDetails },
    {path: 'mybasket', component: Mybasket},
    {path: 'tst-history', component: TstHistory},
    {path: 'mygame', component: Mygame}
];