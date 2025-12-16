import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './vendor-registration.component.html',
  styleUrl: './vendor-registration.component.css'
})
export class VendorRegistrationComponent {
  form!: FormGroup;
  servicesList = ['Food Supply', 'Event Catering', 'Kitchen Equipment', 'Logistics'];
  selectedServices: string[] = [];
  dropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      businessName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      experience: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      services: [[], Validators.required]
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleService(service: string) {
    if (this.selectedServices.includes(service)) {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    } else {
      this.selectedServices.push(service);
    }
    this.form.patchValue({ services: this.selectedServices });
  }

  removeService(service: string) {
    this.selectedServices = this.selectedServices.filter(s => s !== service);
    this.form.patchValue({ services: this.selectedServices });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  submit() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        role: 3, // ✅ Vendor role
        services: this.selectedServices
      };

      this.api.addUser(payload).subscribe({
        next: (res: any) => {
          this.toastr.success('🎉 Vendor Registered Successfully!');
          this.form.reset();
          this.selectedServices = [];
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('Error:', err);
          // Extract error message from API response
          const message = err?.error?.message || err?.message || 'Something went wrong';
          this.toastr.error(message);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
