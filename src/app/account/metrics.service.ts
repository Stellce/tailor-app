import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  backendUrl = environment.backendUrl;
  metricsListener = new Subject<{[s: string]: string}>();

  constructor(private http: HttpClient) {}

  getMetrics() {
    this.http.get<{[s: string]: string}>(`${this.backendUrl}/clients/metrics`).subscribe({
      next: metrics => {
        this.metricsListener.next(metrics);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  postMetrics(metrics: {[s: string]: string}) {
    this.http.post(`${this.backendUrl}/clients/metrics`, {...metrics}).subscribe({
      next: () => {},
      error: err => {
        console.log(err)
      }
    })
  }

  putMetrics(metrics: {[s: string]: string}) {
    this.http.put(`${this.backendUrl}/clients/metrics`, {...metrics}).subscribe({
      next: () => {},
      error: err => {
        console.log(err)
      }
    })
  }
}
