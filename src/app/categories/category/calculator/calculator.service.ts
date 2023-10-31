import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  firstCalcFilledListener = new Subject<boolean>();
  values: {[k: string]: number};
  backendUrl: string = environment.backendUrl;
  constructor(private http: HttpClient) {}

  setValues(values: {[k: string]: number}) {
    this.values = values;
    this.http.get(`${this.backendUrl}/patterns/calculate`, values);
  }

}
