import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixFournisseurSaisieComponent } from './prix-fournisseur-saisie.component';

describe('PrixFournisseurSaisieComponent', () => {
  let component: PrixFournisseurSaisieComponent;
  let fixture: ComponentFixture<PrixFournisseurSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrixFournisseurSaisieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixFournisseurSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
