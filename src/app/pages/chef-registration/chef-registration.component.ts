import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chef-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chef-registration.component.html',
  styleUrl: './chef-registration.component.css'
})
export class ChefRegistrationComponent {
  form!: FormGroup;
  cookingStyles = ['Indian', 'Continental', 'Fusion', 'Street Food'];
  selectedStyles: string[] = [];
  dropdownOpen = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(18)]],
      experience: ['', [Validators.required, Validators.min(0)]],
      cookingStyle: [[], Validators.required],
      address: ['', Validators.required],
      declaration: ['']
    }, { validators: this.experienceValidator });
  }

  // Custom validator to ensure experience doesn't exceed age
  experienceValidator(form: FormGroup) {
    const age = form.get('age')?.value;
    const experience = form.get('experience')?.value;

    if (age && experience && experience > age) {
      form.get('experience')?.setErrors({ exceedsAge: true });
      return { exceedsAge: true };
    }

    // Clear the error if validation passes
    if (form.get('experience')?.hasError('exceedsAge')) {
      const errors = form.get('experience')?.errors;
      if (errors) {
        delete errors['exceedsAge'];
        if (Object.keys(errors).length === 0) {
          form.get('experience')?.setErrors(null);
        }
      }
    }

    return null;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleStyle(style: string) {
    if (this.selectedStyles.includes(style)) {
      this.selectedStyles = this.selectedStyles.filter(s => s !== style);
    } else {
      this.selectedStyles.push(style);
    }
    this.form.patchValue({ cookingStyle: this.selectedStyles });
  }

  removeStyle(style: string) {
    this.selectedStyles = this.selectedStyles.filter(s => s !== style);
    this.form.patchValue({ cookingStyle: this.selectedStyles });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        role: 2, // ✅ cheff role
        cookingStyle: this.selectedStyles.join(', '),
      };

      this.api.addUser(payload).subscribe({
        next: (res: any) => {
          this.toastr.success('🎉 Chef Registered Successfully!');
          this.form.reset();
          this.selectedStyles = [];
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