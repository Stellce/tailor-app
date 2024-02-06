import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../auth/error-dialog/error-dialog.component";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  backendUrl = environment.backendUrl;
  metricsListener = new Subject<{[s: string]: number}>();
  wereMetricsPosted = new Subject<boolean>();

  constructor(private http: HttpClient, private dialog: MatDialog, private authService: AuthService) {}
  getWereMetricsPosted() {
    return this.wereMetricsPosted.asObservable();
  }
  getMetricsListener() {
    return this.metricsListener.asObservable();
  }

  getMetrics() {
    this.http.get<{[s: string]: number}>(`${this.backendUrl}/clients/metrics`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: metrics => {
        this.metricsListener.next(metrics);
      },
      error: () => {}
    })
  }

  postMetrics(metrics: {[s: string]: number}) {
    this.http.post(`${this.backendUrl}/clients/metrics`, {...metrics}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => this.wereMetricsPosted.next(true),
      error: err => {
        this.authService.getToken() ? this.dialog.open(ErrorDialogComponent, {data: {message: 'Metrics were not set yet', isSuccessful: false}}) : false;
        console.log(err)
      }
    })
  }

  putMetrics(metrics: {[s: string]: number}) {
    this.http.put(`${this.backendUrl}/clients/metrics`, {...metrics}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {},
      error: err => {
        this.authService.getToken() ? this.dialog.open(ErrorDialogComponent, {data: {message: 'Default metrics were not set', isSuccessful: false}}) : false;
        console.log(err)
      }
    })
  }
}
