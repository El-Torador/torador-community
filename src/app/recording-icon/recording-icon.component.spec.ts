import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingIconComponent } from './recording-icon.component';

describe('RecordingIconComponent', () => {
  let component: RecordingIconComponent;
  let fixture: ComponentFixture<RecordingIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordingIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
