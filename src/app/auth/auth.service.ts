import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Customer} from "./customer.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {TailorJwtPayload} from "./JwtPayload";
import {User} from "../account/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  isAuthListener = new Subject<boolean>();
  error: HttpErrorResponse;
  token: string;
  tokenTimer: any;
  isAuth: boolean;
  roles: string[];

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  getToken() {
    return this.token;
  }
  getRoles() {
    return this.roles;
  }

  getUser() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.isAuthListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      let decoded: TailorJwtPayload = jwtDecode(this.token);
      this.roles = decoded.roles.replace(/[\[\]']+/g, '').split(',');
      this.setAuthTimer(expiresIn / 1000);
      this.isAuth = true;
      this.isAuthListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    // console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  register(user: Customer) {
    this.http.post(`${this.backendUrl}/clients/register`, user).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this._snackBar.openFromComponent(SnackBarComponent, {duration: 5000, data: "Перевiрте пошту"});
      },
      error: (error) => {
        this.error = error;
        this.dialog.open(ErrorDialogComponent)
      }
    });
  }
  login(user: Customer) {
    let userObj = {
      username: user.email,
      password: user.password
    }
    this.http.post(`${this.backendUrl}/authenticate`, userObj, {responseType: "text"}).subscribe({
      next: (token) => {
        this.token = token;
        let decoded: TailorJwtPayload = jwtDecode(token);
        this.roles = decoded.roles.replace(/[\[\]']+/g, '').split(',');
        // console.log(this.roles);
        this.isAuth = true;
        this.isAuthListener.next(true);

        this.saveAuthData(token, new Date(decoded.exp! * 1000));
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.isAuth = false;
        this.isAuthListener.next(false);
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
      let decoded: TailorJwtPayload = jwtDecode(token);
      this.roles = decoded.roles.replace(/[\[\]']+/g, '').split(',');
      this.saveAuthData(token, new Date(decoded.exp! * 1000));
      this.isAuth = true;
      this.isAuthListener.next(true);
    },
    error: () => {
      this.isAuth = false;
      this.isAuthListener.next(false)
    }
    })
  }

  logout() {
    this.token = '';
    this.isAuth = false;
    this.isAuthListener.next(false);
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
