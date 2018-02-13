import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckupsComponent } from './checkups.component';

describe('CheckupsComponent', () => {
  let component: CheckupsComponent;
  let fixture: ComponentFixture<CheckupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
