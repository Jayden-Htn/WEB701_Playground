import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardModeratorComponent } from './board-moderator.component';

describe('BoardModeratorComponent', () => {
  let component: BoardModeratorComponent;
  let fixture: ComponentFixture<BoardModeratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardModeratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
