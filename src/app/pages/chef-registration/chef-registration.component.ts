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
  showPassword = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

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
        formData.append(key, this.form.value[key]);
      });

      // Append additional fields
      formData.append('role', '2');
      formData.append('cookingStyle', '');

      // Append image if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.api.addUser(formData).subscribe({
        next: (res: any) => {
          this.toastr.success('🎉 Chef Registered Successfully!');
          this.form.reset();
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