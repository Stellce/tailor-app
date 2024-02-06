import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from './about/about.component';
import { CategoriesComponent } from './services/categories/categories.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { SamePasswordsDirective } from './auth/registration/same-passwords.directive';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ErrorDialogComponent } from './auth/error-dialog/error-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CategoryComponent } from './services/categories/category/category.component';
import {MatDividerModule} from "@angular/material/divider";
import { ActivationComponent } from './auth/activation/activation.component';
import {MatTableModule} from "@angular/material/table";
import { VideoDialogComponent } from './services/categories/category/video-dialog/video-dialog.component';
import { AccountComponent } from './account/account.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {OrdersHistoryComponent} from "./account/orders/orders-history/orders-history.component";
import {CalculatorComponent} from "./services/calculator/calculator.component";
import {OrderComponent} from "./account/orders/order/order.component";
import {CalcResFieldsComponent} from "./services/calculator/calc-res-fields/calc-res-fields.component";
import {DialogDataComponent} from "./auth/dialog-data/dialog-data.component";
import {OrdersComponent} from "./account/orders/orders.component";
import {EmployeesComponent} from "./account/employees/employees.component";
import {UserDetailsComponent} from "./account/user-details/user-details.component";
import {EmployeeComponent} from "./account/employees/employee/employee.component";
import {EmployeeRegistrationComponent} from "./account/employees/employee-registration/employee-registration.component";
import {ModelPhotosComponent} from "./services/categories/category/model-photos/model-photos.component";
import {AddModelComponent} from "./services/categories/category/add-model/add-model.component";
import {ReviewsComponent} from "./services/categories/category/reviews/reviews.component";
import {YesNoDialogComponent} from "./account/yes-no-dialog/yes-no-dialog.component";
import {RecoverPasswordComponent} from "./auth/recover-password/recover-password.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    CategoriesComponent,
    RegistrationComponent,
    LoginComponent,
    SamePasswordsDirective,
    ErrorDialogComponent,
    CategoryComponent,
    ActivationComponent,
    VideoDialogComponent,
    AccountComponent,
    OrdersHistoryComponent,
    CalculatorComponent,
    OrderComponent,
    OrdersComponent,
    CalcResFieldsComponent,
    DialogDataComponent,
    EmployeesComponent,
    EmployeeComponent,
    EmployeeRegistrationComponent,
    UserDetailsComponent,
    ModelPhotosComponent,
    AddModelComponent,
    ReviewsComponent,
    YesNoDialogComponent,
    RecoverPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDividerModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true, hasBackdrop: false}}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
