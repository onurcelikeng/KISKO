import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacetypeComponent } from './placetype.component';

describe('PlacetypeComponent', () => {
  let component: PlacetypeComponent;
  let fixture: ComponentFixture<PlacetypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacetypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
