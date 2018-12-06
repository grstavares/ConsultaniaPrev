import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoModalComponent } from './contato-modal.component';

describe('ContatoModalComponent', () => {
  let component: ContatoModalComponent;
  let fixture: ComponentFixture<ContatoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
