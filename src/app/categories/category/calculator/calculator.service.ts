import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  values: {[k: string]: number};
  backendUrl: string = environment.backendUrl;
  constructor(private http: HttpClient) {}

  setValues(values: {[k: string]: number}) {
    this.values = values;
    this.http.post(`${this.backendUrl}/patterns/calculate`, values).subscribe(res => {

    });
  }

}
