import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {UserDetails} from "./user-details.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  backendUrl = environment.backendUrl;
  userDetailsListener = new Subject<UserDetails>();
  constructor(private http: HttpClient, private authService: AuthService) {}

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
      error: (error) => {
        console.log(error['status']);
      }
    })
  }
  postUserDetails(details: UserDetails) {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.post(this.backendUrl + '/clients/details', details, {headers: headers}).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (error) => {
        console.log(error['status']);
      }
    })
  }
  updateUserDetails(details: UserDetails) {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.put(this.backendUrl + '/clients/details', details, {headers: headers}).subscribe({
      next: (res) => console.log(res),
      error: (error) => console.log(error)
    })
  }

}
