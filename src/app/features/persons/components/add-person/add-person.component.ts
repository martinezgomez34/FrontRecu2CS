import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../../../core/services/person.service'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, CommonModule],
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.scss'
})

export class AddPersonComponent {
  personForm: FormGroup;
  lastAddedPerson: any = null;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const personData = {
        name: this.personForm.value.name,
        age: this.personForm.value.age,
        gender: this.personForm.value.gender === 'true' 
      };

      this.personService.addPerson(personData).subscribe({
        next: (response) => {
          console.log(response.message);
          this.lastAddedPerson = personData;
          this.personForm.reset();
          this.checkNewPersons();
        },
        error: (err) => {
          console.error('Error adding person:', err);
        }
      });
    }
  }

  checkNewPersons(): void {
    this.personService.checkNewPersons().subscribe({
      next: (persons) => {
        console.log('Current persons list:', persons);
      },
      error: (err) => {
        console.error('Error checking new persons:', err);
      }
    });
  }
}