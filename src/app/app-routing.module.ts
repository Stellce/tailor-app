import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {PricesComponent} from "./prices/prices.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {LoginComponent} from "./auth/login/login.component";
import {ActivationComponent} from "./auth/activation/activation.component";
import {AccountComponent} from "./account/account.component";
import {OrdersHistoryComponent} from "./account/orders/orders-history/orders-history.component";
import {OrdersComponent} from "./account/orders/orders.component";
import {OrderComponent} from "./account/orders/order/order.component";
import {EmployeeComponent} from "./account/employees/employee/employee.component";
import {EmployeesComponent} from "./account/employees/employees.component";
import {CategoriesComponent} from "./services/categories/categories.component";

const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'categories/:category', component: CategoriesComponent},
  {path: 'prices', component: PricesComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'activate/:id', component: ActivationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'account', component: AccountComponent, children: [
    {path: ':category', component: OrdersHistoryComponent, children: [
      {path: ':orderId', component: OrderComponent},
    ]}
  ]},
  {path: 'orders/:status', component: OrdersComponent, children: [
    {path: ':orderId', component: OrderComponent}
  ]},
  {path: 'employees', component: EmployeesComponent, children: [
      {path: ':employeeId', component: EmployeeComponent}
    ]}
  // {path: '**', redirectTo: 'about'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
