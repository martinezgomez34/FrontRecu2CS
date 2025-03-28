import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Person } from '../interfaces/persona'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private apiService: ApiService) {}

  addPerson(person: Person): Observable<{message: string}> {
    return this.apiService.post('/addPerson', person);
  }

  checkNewPersons(): Observable<Person[]> {
    return this.apiService.get('/newPersonIsAdded');
  }
}