import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Subject} from "rxjs";
import {ResField} from "./resField.model";
import {InputField} from "./inputField.model";
import {ProductMetrics} from "./product-metrics.model";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  backendUrl: string = environment.backendUrl;
  calcValues = {};
  isEditableListener = new Subject<boolean>();

  clientMetrics: InputField[] = [
    {name: 'neckSemiCircumference', text: 'Neck semi circumference', min: 13.5, max: 21.5},
    {name: 'chestSemiCircumference1', text:'First neck semi circumference', min: 33.2, max: 53.2},
    {name: 'chestSemiCircumference2', text: 'Second neck semi circumference', min: 36.4, max: 56.4},
    {name: 'chestSemiCircumference3', text: 'Third neck semi circumference', min: 34, max: 54},
    {name: 'waistSemiCircumference', text:'Waist semi circumference', min: 23.8, max: 43.8},
    {name: 'shoulderWidth', text: 'Shoulder width', min: 8.1, max: 18.1},
    {name: 'chestHeight', text: 'Chest height (from neck spot)', min: 16, max: 36},
    {name: 'chestHeight1', text: 'First chest height (from main neck spot)', min: 23.7, max: 43.7},
    {name: 'backArmholeHeight', text: 'Back armhole height', min: 12.5, max: 22.5},
    {name: 'backLengthTillWaist', text: 'Back length till waist', min: 30.1, max: 50.1},
    {name: 'shoulderHeightSidelong', text: 'Shoulder height sidelong (for control)', min: 32.8, max: 52.8},
    {name: 'chestWidth', text: 'Chest width', min: 11.5, max: 21.5},
    {name: 'chestCenter', text: 'Chest center', min: 4.6, max: 14.6},
    {name: 'backWidth', text: 'Back width', min: 9.3, max: 25.3},
    {name: 'waistLengthFront', text: 'Waist length front', min: 41.5, max: 61.5},
    {name: 'neckBaseToFrontWaistLineDistance', text: 'Neck base to front waist line distance', min: 33, max: 53}
  ];

  clientIncrease: InputField[] = [
    {name: 'increaseToWidthByChestLine', text: 'Increase to width by chest line', min: 2, max: 25},
    {name: 'increaseToArmholeDepth', text: 'Increase to armhole depth', min: 0, max: 5},
    {name: 'increaseToNeckBack', text: 'Increase to neck back', min: 0, max: 5}
  ];

  resFields: ResField[] = [
    {name: 'basisGridWidth', text: 'Basis grid width', res: ''},
    {name: 'basisGridLength', text: 'Basis grid length', res: ''},
    {name: 'armholeDepth', text: 'Armhole depth', res: ''},
    {name: 'backWidth', text: 'Back width', res: ''},
    {name: 'fileWidth', text: 'File width', res: ''},
    {name: 'armholeWidth', text: 'Armhole width', res: ''},
    {name: 'backNeckWidth', text: 'Back neck width', res: ''},
    {name: 'backNeckHeight', text: 'Back neck height', res: ''},
    {name: 'shoulderCutSlope', text: 'Shoulder cut slope', res: ''},
    {name: 'shoulderCutEnd', text: 'Shoulder cut end', res: ''},
    {name: 'productBalance', text: 'Product balance', res: ''},
    {name: 'fileNeckWidth', text: 'File neck width', res: ''},
    {name: 'fileNeckDepth', text: 'File neck depth', res: ''},
    {name: 'chestDart', text: 'Chest dart', res: ''},
    {name: 'shoulderSlope', text: 'Shoulder slope', res: ''},
    {name: 'armhole', text: 'Armhole', res: ''},
    {name: 'totalDartDeviationByWaistLine', text: 'Total dart deviation by waist line', res: ''},
    {name: 'sideDart', text: 'Side dart', res: ''},
    {name: 'fileDart', text: 'File dart', res: ''},
    {name: 'backDart', text: 'Back dart', res: ''}]
  resFieldsListener = new Subject<ResField[]>();
  private isCalculatingListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  getIsEditableListener() {
    return this.isEditableListener.asObservable();
  }
  getResFieldsListener() {
    return this.resFieldsListener.asObservable();
  }
  getInputFieldsFst() {
    return this.clientMetrics;
  }
  getInputFieldsScnd() {
    return this.clientIncrease;
  }
  getIsCalculatingListener() {
    return this.isCalculatingListener.asObservable();
  }
  calculate(productMetrics: ProductMetrics) {
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/patterns/calculate`, productMetrics).subscribe(res => {
      this.isCalculatingListener.next(false);
      this.handleCalcValues(res);
    });
  }

  handleCalcValues(res: {[s: string]: string}) {
    this.calcValues = res;
    this.resFields = this.resFields.map(el => {
      el.res = res[el.name];
      return el;
    });
    this.resFieldsListener.next(this.resFields);
  }

  isEditableEmitter(isEditable: boolean) {
    this.isEditableListener.next(isEditable);
  }
}
