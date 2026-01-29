import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompletGeneriqueComponent } from './autocomplet-generique.component';

describe('AutocompletGeneriqueComponent', () => {
  let component: AutocompletGeneriqueComponent;
  let fixture: ComponentFixture<AutocompletGeneriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompletGeneriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompletGeneriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
