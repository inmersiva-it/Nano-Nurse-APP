import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  readonly stats = [
    { label: 'Pacientes Activos', value: '12' },
    { label: 'Nanobots en Reserva', value: '88,000' },
    { label: 'Estado de Red', value: 'Óptimo' },
  ];
}
