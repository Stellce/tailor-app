import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Customer} from "./customer.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";
import {jwtDecode} from 'jwt-decode';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "./registration/snack-bar/snack-bar.component";
import {TailorJwtPayload} from "./JwtPayload";
import {User} from "../account/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  userListener = new Subject<User>();
  error: HttpErrorResponse;
  token: string;
  tokenTimer: any;
  user: User = {
    isAuth: false,
    roles: []
  };
  allRoles: string[] = [
    'CLIENT', 'EMPLOYEE', 'ADMIN'
  ];

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  getTokenHeader() {
    return (new HttpHeaders()).set("Authorization", "Bearer "+ this.getToken())
  }
  getToken() {
    return this.token;
  }
  getAllRoles() {
    return this.allRoles;
  }
  getUser() {
    return this.user;
  }
  getUserListener() {
    return this.userListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);
      this.authenticate(authInformation.token);
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
      error: () => {
        this.dialog.open(ErrorDialogComponent, {data: {message: '', isSuccessful: false}});
        this.router.navigate(['/']);
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
        this.authenticate(token);

        this.saveAuthData(token, new Date(decoded.exp! * 1000));
        this.router.navigate(['/categories/midi_coat']);
      },
      error: () => {
        this.user.isAuth = false;
        this.userListener.next(this.user);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Неправильний логiн, або пароль', isSuccessful: false}});
      }
    });
  }

  activateAccount(id: string) {
    this.http.post(`${this.backendUrl}/users/activate/${id}`, {}, {responseType: "text"}).subscribe({
    next: (token) => {
      let decoded: TailorJwtPayload = jwtDecode(token);
      this.authenticate(token);
      this.saveAuthData(token, new Date(decoded.exp! * 1000));
    },
    error: () => {
      this.user.isAuth = false;
      this.dialog.open(ErrorDialogComponent, {data: {message: '', isSuccessful: false}});
      this.userListener.next(this.user);
    }
    })
  }

  logout() {
    this.token = '';
    this.user.isAuth = false;
    this.user.roles = [];
    this.userListener.next(this.user);
    this.clearAuthData();
  }

  private authenticate(token: string) {
    this.token = token;
    let decoded: TailorJwtPayload = jwtDecode(this.token);
    this.user.roles = decoded.roles.replace(/[\[\]'\s]+/g, '').split(',');
    this.user.isAuth = true;
    this.userListener.next(this.user);
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
    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
