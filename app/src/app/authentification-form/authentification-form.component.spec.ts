import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthentificationFormComponent } from './authentification-form.component';

describe('AuthentificationFormComponent', () => {
  let component: AuthentificationFormComponent;
  let fixture: ComponentFixture<AuthentificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthentificationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthentificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
