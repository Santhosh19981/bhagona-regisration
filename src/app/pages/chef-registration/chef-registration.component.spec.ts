import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefRegistrationComponent } from './chef-registration.component';

describe('ChefRegistrationComponent', () => {
  let component: ChefRegistrationComponent;
  let fixture: ComponentFixture<ChefRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
