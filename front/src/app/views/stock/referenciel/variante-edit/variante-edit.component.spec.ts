import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarianteEditComponent } from './variante-edit.component';

describe('VarianteEditComponent', () => {
  let component: VarianteEditComponent;
  let fixture: ComponentFixture<VarianteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarianteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarianteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
