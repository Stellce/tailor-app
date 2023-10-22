import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {ServicesComponent} from "./services/services.component";
import {PricesComponent} from "./prices/prices.component";
import {RegistrationComponent} from "./registration/registration.component";

const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'prices', component: PricesComponent},
  {path: 'registration', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
