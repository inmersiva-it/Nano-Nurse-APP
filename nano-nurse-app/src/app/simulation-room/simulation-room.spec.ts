import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationRoom } from './simulation-room';

describe('SimulationRoom', () => {
  let component: SimulationRoom;
  let fixture: ComponentFixture<SimulationRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
