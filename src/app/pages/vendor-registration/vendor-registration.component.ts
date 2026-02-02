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
  showPassword = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

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
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.warning('File size should be less than 5MB');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.form.valid) {
      const formData = new FormData();

      // Append all form fields
      Object.keys(this.form.value).forEach(key => {
        if (key === 'services') {
          formData.append(key, this.selectedServices.join(', '));
        } else {
          formData.append(key, this.form.value[key]);
        }
      });

      // Append additional fields
      formData.append('role', '3');

      // Append image if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.api.addUser(formData).subscribe({
        next: (res: any) => {
          this.toastr.success('🎉 Vendor Registered Successfully!');
          this.form.reset();
          this.selectedServices = [];
          this.selectedFile = null;
          this.imagePreview = null;
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('Error:', err);
          const message = err?.error?.message || err?.message || 'Something went wrong';
          this.toastr.error(message);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
