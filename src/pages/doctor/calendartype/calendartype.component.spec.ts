import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendartypeComponent } from './calendartype.component';

describe('CalendartypeComponent', () => {
  let component: CalendartypeComponent;
  let fixture: ComponentFixture<CalendartypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendartypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendartypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
