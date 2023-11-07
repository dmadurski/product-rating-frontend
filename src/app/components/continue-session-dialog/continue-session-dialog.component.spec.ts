import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueSessionDialogComponent } from './continue-session-dialog.component';

describe('ContinueSessionDialogComponent', () => {
  let component: ContinueSessionDialogComponent;
  let fixture: ComponentFixture<ContinueSessionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContinueSessionDialogComponent]
    });
    fixture = TestBed.createComponent(ContinueSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
