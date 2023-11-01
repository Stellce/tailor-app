import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AppService} from "../../../app.service";
import {AuthService} from "../../../auth/auth.service";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  values: {[k: string]: number};
  backendUrl: string = environment.backendUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  setValues(values: {[k: string]: number}) {
    this.values = values;
    let headers = new HttpHeaders();
    console.log(this.authService.getToken());
    const authToken = this.authService.getToken();
    headers = headers.set("Authorization", "Bearer " + authToken);
    console.log(headers)
    this.http.post(`${this.backendUrl}/patterns/calculate/save`, values, {headers: headers}).subscribe(res => {
      console.log(res);
    });
  }

}
