import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueEditComponent } from './marque-edit.component';

describe('MarqueEditComponent', () => {
  let component: MarqueEditComponent;
  let fixture: ComponentFixture<MarqueEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarqueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
