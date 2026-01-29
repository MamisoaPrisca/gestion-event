import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionnementComponent } from './conditionnement.component';

describe('ConditionnementComponent', () => {
  let component: ConditionnementComponent;
  let fixture: ComponentFixture<ConditionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
