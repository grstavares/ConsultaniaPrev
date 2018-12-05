import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguradosComponent } from './segurados.component';

describe('SeguradosComponent', () => {
  let component: SeguradosComponent;
  let fixture: ComponentFixture<SeguradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
