import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionnementEditComponent } from './conditionnement-edit.component';

describe('ConditionnementEditComponent', () => {
  let component: ConditionnementEditComponent;
  let fixture: ComponentFixture<ConditionnementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionnementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionnementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
