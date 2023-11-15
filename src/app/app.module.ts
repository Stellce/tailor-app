import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AboutComponent } from './about/about.component';
import { CategoriesComponent } from './categories/categories.component';
import { PricesComponent } from './prices/prices.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ContactsComponent } from './footer/contacts/contacts.component';
import { AddressComponent } from './footer/address/address.component';
import { LoginComponent } from './auth/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { SamePasswordsDirective } from './auth/registration/same-passwords.directive';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ErrorDialogComponent } from './auth/error-dialog/error-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CategoryComponent } from './categories/category/category.component';
import {MatDividerModule} from "@angular/material/divider";
import { ActivationComponent } from './auth/activation/activation.component';
import {MatTableModule} from "@angular/material/table";
import {AuthInterceptor} from "./auth/auth-interceptor";
import { VideoDialogComponent } from './categories/video-dialog/video-dialog.component';
import { AccountComponent } from './account/account.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatExpansionModule} from "@angular/material/expansion";
import {OrdersComponent} from "./account/orders/orders.component";
import {CalculatorComponent} from "./categories/category/calculator/calculator.component";
import {ServicesComponent} from "./services/services.component";
import {OrderComponent} from "./account/orders/order/order.component";
import {CalcResFieldsComponent} from "./categories/category/calculator/calc-res-fields/calc-res-fields.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    CategoriesComponent,
    PricesComponent,
    RegistrationComponent,
    ContactsComponent,
    AddressComponent,
    LoginComponent,
    SamePasswordsDirective,
    ErrorDialogComponent,
    CategoryComponent,
    ActivationComponent,
    VideoDialogComponent,
    AccountComponent,
    OrdersComponent,
    CalculatorComponent,
    ServicesComponent,
    OrderComponent,
    CalcResFieldsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDividerModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MatExpansionModule
  ],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
    // MatDatepickerModule
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor
    // }
  ],
  exports: [
    CategoriesComponent,
    CalculatorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
