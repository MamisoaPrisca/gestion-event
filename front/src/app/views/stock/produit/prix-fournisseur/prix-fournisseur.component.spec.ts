import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixFournisseurComponent } from './prix-fournisseur.component';

describe('PrixFournisseurComponent', () => {
  let component: PrixFournisseurComponent;
  let fixture: ComponentFixture<PrixFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrixFournisseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
