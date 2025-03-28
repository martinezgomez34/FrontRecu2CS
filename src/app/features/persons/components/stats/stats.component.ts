import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../../core/services/stats.service'; 
import { GenderStats } from '../../../../core/interfaces/gender-stats';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats: GenderStats | null = null;
  loading = false;
  lastUpdate: Date | null = null;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.stats = null;

    this.statsService.getGenderStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.lastUpdate = new Date();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }
}