import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard } from './dashboard/dashboard';
import { PatientList } from './patient-list/patient-list';
import { SimulationRoom } from './simulation-room/simulation-room';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Dashboard, PatientList, SimulationRoom],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  readonly activeView = signal<'dashboard' | 'patients' | 'simulation'>('dashboard');
  readonly connected = signal(true);
  readonly patients = [
    {
      id: 'P-001',
      name: 'John Doe',
      diagnosis: 'Infección Viral Aguda en Pulmón',
      status: 'Estable',
      note: 'Nanobots en espera; revisión de imágenes de tomografía computarizada programada.',
    },
    {
      id: 'P-002',
      name: 'Jane Smith',
      diagnosis: 'Coágulo Sanguíneo en Arteria Femoral',
      status: 'Crítico',
      note: 'Lista para protocolo de disolución con nanofibras guiadas.',
    },
    {
      id: 'P-003',
      name: 'Alex Rover',
      diagnosis: 'Degradación Celular por Radiación',
      status: 'Observación',
      note: 'Monitorización continua del ritmo celular y suministro de medicación.',
    },
  ];
  readonly selectedPatient = signal(this.patients[0]);
  readonly simulationState = signal<'idle' | 'running' | 'done'>('idle');
  readonly progress = signal(0);

  setView(view: 'dashboard' | 'patients' | 'simulation') {
    this.activeView.set(view);
  }

  selectPatient(patient: { id: string; name: string; diagnosis: string; status: string; note: string }) {
    this.selectedPatient.set(patient);
    this.simulationState.set('idle');
    this.progress.set(0);
    this.activeView.set('simulation');
  }

  injectNanobots() {
    if (this.simulationState() === 'running') {
      return;
    }
    this.simulationState.set('running');
    this.progress.set(0);

    const interval = window.setInterval(() => {
      const next = Math.min(100, this.progress() + 6);
      this.progress.set(next);

      if (next >= 100) {
        window.clearInterval(interval);
        this.simulationState.set('done');
      }
    }, 130);
  }
}
