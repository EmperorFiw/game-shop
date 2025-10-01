import { Routes } from '@angular/router';
import { Home } from './user-pages/home/home';
import { Login } from './user-pages/login/login';
import { Register } from './user-pages/register/register';

export const routes: Routes = [
    {path: '', component: Login },
    {path: 'register', component: Register },
];