import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {UserDetails} from "./user-details.model";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../auth/error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  backendUrl = environment.backendUrl;
  userDetailsListener = new Subject<UserDetails>();
  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) {}

  getUserDetailsListener() {
    return this.userDetailsListener.asObservable();
  }

  getUserDetails() {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.get<UserDetails>(this.backendUrl + '/clients/details', {headers: headers}).subscribe({
      next: (userDetails) => {
        this.userDetailsListener.next(userDetails);
      },
      error: () => {}
    })
  }
  postUserDetails(details: UserDetails) {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.post(this.backendUrl + '/clients/details', details, {headers: headers}).subscribe({
      next: () => this.dialog.open(ErrorDialogComponent, {data: {message: 'Data saved', isSuccessful: true}}),
      error: () => this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}})
    })
  }
  updateUserDetails(details: UserDetails) {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.put(this.backendUrl + '/clients/details', details, {headers: headers}).subscribe({
      next: () => this.dialog.open(ErrorDialogComponent, {data: {message: 'Data saved', isSuccessful: true}}),
      error: () => this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}}),
    })
  }

}
