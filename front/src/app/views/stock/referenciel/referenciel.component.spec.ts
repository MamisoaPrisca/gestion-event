import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencielComponent } from './referenciel.component';

describe('ReferencielComponent', () => {
  let component: ReferencielComponent;
  let fixture: ComponentFixture<ReferencielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferencielComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferencielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
