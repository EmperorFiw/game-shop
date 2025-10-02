import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from "../navbar/navbar";
@Component({
  selector: 'app-mybasket',
  imports: [Navbar,RouterLink, CommonModule],
  templateUrl: './mybasket.html',
  styleUrl: './mybasket.scss'
})
export class Mybasket {
  constructor(public location: Location) {}
}
