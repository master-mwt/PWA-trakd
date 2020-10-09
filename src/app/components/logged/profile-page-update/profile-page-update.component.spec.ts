import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageUpdateComponent } from './profile-page-update.component';

describe('ProfilePageUpdateComponent', () => {
  let component: ProfilePageUpdateComponent;
  let fixture: ComponentFixture<ProfilePageUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePageUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
