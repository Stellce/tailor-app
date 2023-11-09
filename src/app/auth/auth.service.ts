import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";
import {jwtDecode, JwtPayload} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  authStatusListener = new Subject<boolean>();
  error: HttpErrorResponse;
  token: string;
  tokenTimer: any;
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

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      console.log('activated')
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
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
        let decoded: JwtPayload = jwtDecode(token);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);

        this.saveAuthData(token, new Date(decoded.exp! * 1000));
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.error = error;
        console.log(error)
        this.dialog.open(ErrorDialogComponent);
      }
    });
  }

  activateAccount(id: string) {
    this.http.post(`${this.backendUrl}/users/activate/${id}`, {}, {responseType: "text"}).subscribe({
    next: (token) => {
      this.token = token;
      let decoded = jwtDecode(token);
      this.saveAuthData(token, new Date(decoded.exp! * 1000));
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    },
    error: () => {
      this.isAuthenticated = false;
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

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

}
