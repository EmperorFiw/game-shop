import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from "../navbar/navbar";
@Component({
  selector: 'app-movie-details',
   standalone: true,
  imports: [RouterModule, Navbar],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss'
})
export class MovieDetails {

}
