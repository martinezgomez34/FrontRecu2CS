// person.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Person } from '../interfaces/persona'; 
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  // BehaviorSubject para mantener y emitir la lista actual de personas
  private personsSubject = new BehaviorSubject<Person[]>([]);
  persons$ = this.personsSubject.asObservable();
  
  // Variable para controlar el polling
  private pollingActive = false;
  private pollingInterval = 3000;
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  addPerson(person: Person): Observable<{message: string}> {
    return this.apiService.post('/addPerson', person);
  }

  checkNewPersons(): Observable<Person[]> {
    return this.apiService.get('/newPersonIsAdded');
  }

  // Iniciar polling para verificar nuevas personas
  startPolling(): void {
    if (!this.isBrowser || this.pollingActive) return;
    
    this.pollingActive = true;
    this.loadPersons();
    this.pollForNewPersons();
  }

  private pollForNewPersons(): void {
    if (!this.isBrowser || !this.pollingActive) return;

    setTimeout(() => {
      if (this.pollingActive) {
        this.checkNewPersons().subscribe({
          next: (persons) => {
            this.personsSubject.next(persons);
            this.pollForNewPersons();
          },
          error: (err) => {
            console.error('Error en polling:', err);
            if (this.pollingActive) {
              setTimeout(() => this.pollForNewPersons(), 5000);
            }
          }
        });
      }
    }, this.pollingInterval);
  }

  // Detener el polling
  stopPolling(): void {
    this.pollingActive = false;
  }

  // Cargar todas las personas
  loadPersons(): void {
    if (!this.isBrowser) return;
    
    this.checkNewPersons().subscribe({
      next: (persons) => {
        this.personsSubject.next(persons);
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
      }
    });
  }

  // Forzar una actualización manual
  forceRefresh(): Observable<Person[]> {
    return this.checkNewPersons();
  }

  isPollingActive(): boolean {
    return this.pollingActive;
  }
}