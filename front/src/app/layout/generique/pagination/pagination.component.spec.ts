import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationGenregiqueComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationGenregiqueComponent;
  let fixture: ComponentFixture<PaginationGenregiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationGenregiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationGenregiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
