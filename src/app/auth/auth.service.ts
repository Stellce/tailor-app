import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Customer} from "./customer.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";
import {jwtDecode} from 'jwt-decode';
import {MatSnackBar} from "@angular/material/snack-bar";
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
    roles: [],
    username: ''
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
        this.dialog.open(ErrorDialogComponent, {data: "Перевiрте пошту"})
      },
      error: (err) => {
        console.log(err);
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
      error: (err) => {
        this.user.isAuth = false;
        this.userListener.next(this.user);
        if(err['status']===403) return this.dialog.open(ErrorDialogComponent, {data: {message: 'Неправильний логiн, або пароль', isSuccessful: false}});
        this.dialog.open(ErrorDialogComponent);
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

  recover(email: string) {
    const params = new HttpParams().set('email', email);
    this.http.get(`${this.backendUrl}/users/recover-password/send-email`, {params: params, responseType: "text"}).subscribe({
      next: (token) => {
        this.token = token;
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Перевiрте пошту', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }

  passwordChange(password: string) {
    const params = new HttpParams()
      .set('token', this.token)
      .set('pass', password);
    this.http.post(`${this.backendUrl}/users/recover-password`, {}, {params: params}).subscribe({
      next: () => this.dialog.open(ErrorDialogComponent, {data: {message: 'Пароль змiнено', isSuccessful: true}}),
      error: () => this.dialog.open(ErrorDialogComponent)
    })
  }

  private authenticate(token: string) {
    this.token = token;
    let decoded: TailorJwtPayload = jwtDecode(this.token);
    this.user.roles = decoded.roles.replace(/[\[\]'\s]+/g, '').split(',');
    this.user.username = decoded.sub;
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
