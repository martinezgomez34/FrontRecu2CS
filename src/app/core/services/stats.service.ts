import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; 
import { GenderStats } from '../interfaces/gender-stats';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private apiService: ApiService) {}

  getGenderStats(): Observable<GenderStats> {
    return this.apiService.get('/countGender');
  }
}