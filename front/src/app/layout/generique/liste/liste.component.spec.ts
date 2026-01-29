import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeGeneriqueComponent } from './liste.component';

describe('ListeComponent', () => {
  let component: ListeGeneriqueComponent;
  let fixture: ComponentFixture<ListeGeneriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeGeneriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeGeneriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
