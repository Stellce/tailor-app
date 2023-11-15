import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {PricesComponent} from "./prices/prices.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {LoginComponent} from "./auth/login/login.component";
import {ActivationComponent} from "./auth/activation/activation.component";
import {AccountComponent} from "./account/account.component";
import {CategoryComponent} from "./categories/category/category.component";
import {OrdersComponent} from "./account/orders/orders.component";
import {ServicesComponent} from "./services/services.component";
import {OrderComponent} from "./account/orders/order/order.component";

const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'categories', component: ServicesComponent, children: [
      {path: ':category', component: CategoryComponent}
    ]},
  {path: 'prices', component: PricesComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'activate/:id', component: ActivationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'account', component: AccountComponent, children: [
      {path: ':category', component: OrdersComponent, children: [
          {path: ':modelId', component: OrderComponent}
        ]}
    ]},
  {path: '**', redirectTo: 'about'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
