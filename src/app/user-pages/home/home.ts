
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from "../navbar/navbar";
// import { RouterLink } from '@angular/router';

  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule, CommonModule, Navbar],
    templateUrl: './home.html',
    styleUrl: './home.scss'
  })
  export class Home {
 
  }
