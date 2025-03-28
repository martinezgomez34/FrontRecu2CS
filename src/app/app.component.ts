import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddPersonComponent } from "./features/persons/components/add-person/add-person.component";
import { StatsComponent } from "./features/persons/components/stats/stats.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddPersonComponent, StatsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Front';
}
