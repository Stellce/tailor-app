import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Subject} from "rxjs";
import {ResField} from "./resField.model";
import {InputField} from "./inputField.model";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  backendUrl: string = environment.backendUrl;
  calcValues = {};

  inputFieldsFst: InputField[] = [
    {name: 'neckSemiCircumference', text: 'Напiвобхват шиї'},
    {name: 'chestSemiCircumference1', text:'Напiвобхват грудей перший'},
    {name: 'chestSemiCircumference2', text: 'Напiвобхват грудей другий'},
    {name: 'chestSemiCircumference3', text: 'Напiвобхват грудей третій'},
    {name: 'waistSemiCircumference', text:'Напiвобхват талії'},
    {name: 'shoulderWidth', text: 'Ширина плечового схилу'},
    {name: 'chestHeight', text: 'Висота грудей перша (вiд точки основи шиї)'},
    {name: 'chestHeight1', text: 'Висота грудей (вiд шийної точки)'},
    {name: 'backArmholeHeight', text: 'Висота пройми ззаду'},
    {name: 'backLengthTillWaist', text: 'Довжина спини до талії'},
    {name: 'shoulderHeightSidelong', text: 'Висота плеча коса (для контролю)'},
    {name: 'chestWidth', text: 'Ширина грудей'},
    {name: 'chestCenter', text: 'Центр грудей'},
    {name: 'backWidth', text: 'Ширина спини'},
    {name: 'waistLengthFront', text: 'Довжина талії переду'},
    {name: 'neckBaseToFrontWaistLineDistance', text: 'Відстань вiд точки основи шиї лінії талії спереду'}
  ];

  inputFieldsScnd: InputField[] = [
    {name: 'increaseToWidthByChestLine', text: 'До ширини виробу по лінії грудей'},
    {name: 'increaseToArmholeDepth', text: 'До глибини пройми'},
    {name: 'increaseToNeckBack', text: 'До ширини горловини спинки і пілочки'}
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
    {name: 'sideSlopeTop', text: 'Вершина бічного зрізу', res: ''},
    {name: 'backArmholeSlope', text: 'Зріз пройми спинки', res: ''},
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
  constructor(private http: HttpClient) {}

  getInputFieldsFst() {
    return this.inputFieldsFst;
  }
  getInputFieldsScnd() {
    return this.inputFieldsScnd;
  }
  calculate(values: {[k: string]: number}) {
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/patterns/calculate`, values).subscribe(res => {
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

}
