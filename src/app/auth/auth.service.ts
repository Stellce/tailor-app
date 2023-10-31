import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {catchError, retry, Subject, throwError} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "./error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  authStatusListener = new Subject<boolean>();
  error: HttpErrorResponse;

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  sendRegistration(user: User) {
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
  sendLogin(user: User) {
    this.http.post(`${this.backendUrl}/authenticate`, user).subscribe({
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

  onAccountActivate(id: string) {
    this.http.post(`${this.backendUrl}/users/activate/${id}`, {}).subscribe({
    next: () => {
      this.authStatusListener.next(true);
    },
    error: () => {
      this.authStatusListener.next(false)
    }
    })
  }
}
