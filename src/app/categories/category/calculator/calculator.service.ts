import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  firstCalcFilledListener = new Subject<boolean>();

  firstCalcValues: any;
  constructor() {}

  setFirstCalcValues(values: any) {
    this.firstCalcValues = values;
  }

}
