import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemnotificaitonComponent } from './systemnotificaiton.component';

describe('SystemnotificaitonComponent', () => {
  let component: SystemnotificaitonComponent;
  let fixture: ComponentFixture<SystemnotificaitonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemnotificaitonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemnotificaitonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
