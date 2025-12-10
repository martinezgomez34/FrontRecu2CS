// add-person.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../../../core/services/person.service'; 
import { Person } from '../../../../core/interfaces/persona';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule, 
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.scss'
})
export class AddPersonComponent implements OnInit, AfterViewInit, OnDestroy {
  personForm: FormGroup;
  lastAddedPerson: Person | null = null;
  allPersons: Person[] = [];
  
  isLoading = false;
  isPollingActive = false;
  errorMessage: string = '';
  isBrowser: boolean;
  
  private personsSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Solo suscribirse a los cambios, pero no iniciar polling aquí
    this.personsSubscription = this.personService.persons$.subscribe({
      next: (persons) => {
        this.allPersons = persons;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al recibir personas:', err);
        this.errorMessage = 'Error al cargar la lista de personas';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Solo en el navegador, cargar personas e iniciar polling
    if (this.isBrowser) {
      this.loadAllPersons();
      this.startAutoUpdate();
    }
  }

  loadAllPersons(): void {
    this.isLoading = true;
    this.personService.loadPersons();
  }

  startAutoUpdate(): void {
    this.isPollingActive = true;
    this.personService.startPolling();
  }

  stopAutoUpdate(): void {
    this.isPollingActive = false;
    this.personService.stopPolling();
  }

  toggleAutoUpdate(): void {
    if (this.isPollingActive) {
      this.stopAutoUpdate();
    } else {
      this.startAutoUpdate();
    }
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const personData: Person = {
        name: this.personForm.value.name,
        age: this.personForm.value.age,
        gender: this.personForm.value.gender === 'true'
      };

      this.personService.addPerson(personData).subscribe({
        next: (response) => {
          console.log('Persona agregada:', response.message);
          this.lastAddedPerson = personData;
          this.personForm.reset();
          
          // Forzar una verificación inmediata
          this.forceRefresh();
        },
        error: (err) => {
          console.error('Error adding person:', err);
          this.errorMessage = 'Error al agregar la persona. Intente nuevamente.';
        }
      });
    }
  }

  forceRefresh(): void {
    this.personService.forceRefresh().subscribe({
      next: (persons) => {
        console.log('Lista actualizada manualmente:', persons);
      },
      error: (err) => {
        console.error('Error al forzar actualización:', err);
      }
    });
  }

  getGenderText(gender: boolean): string {
    return gender ? 'Male' : 'Female';
  }

  getGenderIcon(gender: boolean): string {
    return gender ? 'male' : 'female';
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.personsSubscription.unsubscribe();
    this.stopAutoUpdate();
  }
}