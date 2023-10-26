import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { PricesComponent } from './prices/prices.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ContactsComponent } from './footer/contacts/contacts.component';
import { AddressComponent } from './footer/address/address.component';
import { LoginComponent } from './auth/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { SamePasswordsDirective } from './auth/registration/same-passwords.directive';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ErrorDialogComponent } from './auth/error-dialog/error-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    ServicesComponent,
    PricesComponent,
    RegistrationComponent,
    ContactsComponent,
    AddressComponent,
    LoginComponent,
    SamePasswordsDirective,
    ErrorDialogComponent
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
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
