import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysecretaryComponent } from './mysecretary.component';

describe('MysecretaryComponent', () => {
  let component: MysecretaryComponent;
  let fixture: ComponentFixture<MysecretaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysecretaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysecretaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
