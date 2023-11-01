import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {CategoriesComponent} from "./categories/categories.component";
import {PricesComponent} from "./prices/prices.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {LoginComponent} from "./auth/login/login.component";
import {ActivationComponent} from "./auth/activation/activation.component";

const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'categories/:category', component: CategoriesComponent},
  {path: 'prices', component: PricesComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'activate/:id', component: ActivationComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
