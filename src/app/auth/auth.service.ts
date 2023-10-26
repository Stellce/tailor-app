import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  error: string;
  authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  sendRegistration(user: User) {
    this.http.post(`${this.backendUrl}`, user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
        this.dialog.open(ErrorDialogComponent)
      }
    });
  }
  sendLogin(user: User) {
    this.http.post(`${this.backendUrl}`, user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
        this.dialog.open(ErrorDialogComponent);
        this.router.navigate(['/']);
      }
    });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}
