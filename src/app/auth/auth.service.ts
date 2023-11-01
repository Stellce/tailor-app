import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {catchError, retry, Subject, throwError} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  authStatusListener = new Subject<boolean>();
  error: HttpErrorResponse;
  token: string;
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  register(user: User) {
    this.http.post(`${this.backendUrl}/clients/register`, user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
        this.dialog.open(ErrorDialogComponent)
      }
    });
  }
  login(user: User) {
    let userObj = {
      username: user.email,
      password: user.password
    }
    this.http.post(`${this.backendUrl}/authenticate`, userObj, {responseType: "text"}).subscribe({
      next: (token) => {
        this.token = token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        console.log(token);

        // const tokenInfo = this.getDecodedAccessToken(token); // decode token
        // const expireDate = tokenInfo.exp; // get token expiration dateTime
        // console.log(tokenInfo); // show decoded token object in console

        this.saveAuthData(token, new Date(new Date().getTime() + (24 * 60 * 60 * 1000)));
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.error = error;
        console.log(error)
        this.dialog.open(ErrorDialogComponent);
        this.router.navigate(['/']);
      }
    });
  }

  activateAccount(id: string) {
    this.http.post(`${this.backendUrl}/users/activate/${id}`, {}, {responseType: "text"}).subscribe({
    next: (token) => {
      this.token = token;
      this.authStatusListener.next(true);
    },
    error: () => {
      this.authStatusListener.next(false)
    }
    })
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration")
  }

  // private getDecodedAccessToken(token: string): any {
  //   try {
  //     return jwt_decode(token);
  //   } catch(Error) {
  //     return null;
  //   }
  // }

}
