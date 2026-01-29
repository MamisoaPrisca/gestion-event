import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixFournisseurModifComponent } from './prix-fournisseur-modif.component';

describe('PrixFournisseurModifComponent', () => {
  let component: PrixFournisseurModifComponent;
  let fixture: ComponentFixture<PrixFournisseurModifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrixFournisseurModifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixFournisseurModifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
