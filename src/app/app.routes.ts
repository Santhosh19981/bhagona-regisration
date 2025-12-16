import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChefRegistrationComponent } from './pages/chef-registration/chef-registration.component';
import { VendorRegistrationComponent } from './pages/vendor-registration/vendor-registration.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chef-registration', component: ChefRegistrationComponent },
  { path: 'vendor-registration', component: VendorRegistrationComponent },
];

