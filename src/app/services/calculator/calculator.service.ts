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
    {name: 'neckSemiCircumference', text: 'Напiвобхват шиї', min: 13.5, max: 21.5},
    {name: 'chestSemiCircumference1', text:'Напiвобхват грудей перший', min: 33.2, max: 53.2},
    {name: 'chestSemiCircumference2', text: 'Напiвобхват грудей другий', min: 36.4, max: 56.4},
    {name: 'chestSemiCircumference3', text: 'Напiвобхват грудей третій', min: 34, max: 54},
    {name: 'waistSemiCircumference', text:'Напiвобхват талії', min: 23.8, max: 43.8},
    {name: 'shoulderWidth', text: 'Ширина плечового схилу', min: 8.1, max: 18.1},
    {name: 'chestHeight', text: 'Висота грудей (вiд шийної точки)', min: 16, max: 36},
    {name: 'chestHeight1', text: 'Висота грудей перша (вiд точки основи шиї)', min: 23.7, max: 43.7},
    {name: 'backArmholeHeight', text: 'Висота пройми ззаду', min: 12.5, max: 22.5},
    {name: 'backLengthTillWaist', text: 'Довжина спини до талії', min: 30.1, max: 50.1},
    {name: 'shoulderHeightSidelong', text: 'Висота плеча коса (для контролю)', min: 32.8, max: 52.8},
    {name: 'chestWidth', text: 'Ширина грудей', min: 11.5, max: 21.5},
    {name: 'chestCenter', text: 'Центр грудей', min: 4.6, max: 14.6},
    {name: 'backWidth', text: 'Ширина спини', min: 9.3, max: 25.3},
    {name: 'waistLengthFront', text: 'Довжина талії переду', min: 41.5, max: 61.5},
    {name: 'neckBaseToFrontWaistLineDistance', text: 'Відстань вiд точки основи шиї до лінії талії спереду', min: 33, max: 53}
  ];

  clientIncrease: InputField[] = [
    {name: 'increaseToWidthByChestLine', text: 'До ширини виробу по лінії грудей', min: 2, max: 25},
    {name: 'increaseToArmholeDepth', text: 'До глибини пройми', min: 0, max: 5},
    {name: 'increaseToNeckBack', text: 'До ширини горловини спинки і пілочки', min: 0, max: 5}
  ];

  resFields: ResField[] = [
    {name: 'basisGridWidth', text: 'Ширина виробу по лінії грудей', res: ''},
    {name: 'basisGridLength', text: 'Довжина виробу', res: ''},
    {name: 'armholeDepth', text: 'Глибина пройми', res: ''},
    {name: 'backWidth', text: 'Ширина спинки', res: ''},
    {name: 'fileWidth', text: 'Ширина пілочки', res: ''},
    {name: 'armholeWidth', text: 'Ширина пройми', res: ''},
    {name: 'backNeckWidth', text: 'Ширина горловини спинки', res: ''},
    {name: 'backNeckHeight', text: 'Висота горловини спинки', res: ''},
    {name: 'shoulderCutSlope', text: 'Схил плечового зрізу', res: ''},
    {name: 'shoulderCutEnd', text: 'Кінець плечового зрізу', res: ''},
    {name: 'productBalance', text: 'Баланс виробу', res: ''},
    {name: 'fileNeckWidth', text: 'Ширина горловини пілочки', res: ''},
    {name: 'fileNeckDepth', text: 'Глибина горловини пілочки', res: ''},
    {name: 'chestDart', text: 'Нагрудна виточка', res: ''},
    {name: 'shoulderSlope', text: 'Плечовий зріз', res: ''},
    {name: 'armhole', text: 'Пройма', res: ''},
    {name: 'totalDartDeviationByWaistLine', text: 'Сумарний розхил виточок по лінії талії', res: ''},
    {name: 'sideDart', text: 'Бічна виточка', res: ''},
    {name: 'fileDart', text: 'Виточка пілочки', res: ''},
    {name: 'backDart', text: 'Виточка спинки', res: ''}]
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
