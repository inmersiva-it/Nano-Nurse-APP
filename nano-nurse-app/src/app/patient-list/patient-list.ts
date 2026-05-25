import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type Patient = {
  id: string;
  name: string;
  diagnosis: string;
  status: string;
  note: string;
};

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.css'],
})
export class PatientList {
  @Input() patients: Patient[] = [];
  @Output() selectPatient = new EventEmitter<Patient>();

  stateClass(status: string) {
    return {
      'status-pill': true,
      'status-stable': status === 'Estable',
      'status-warning': status === 'Observación',
      'status-critical': status === 'Crítico',
    };
  }
}
