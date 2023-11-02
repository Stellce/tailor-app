import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../auth/auth.service";
import {Subject} from "rxjs";
import {ResField} from "./resField.model";

@Injectable({providedIn: 'root'})
export class CalculatorService {
  values: {[k: string]: number};
  backendUrl: string = environment.backendUrl;
  calcValues = {};
  resFieldsListener = new Subject<ResField[]>();

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
  constructor(private http: HttpClient, private authService: AuthService) {}

  calculate(values: {[k: string]: number}) {
    this.values = values;


    let headers = new HttpHeaders();
    let save = '';
    if(this.authService.isAuthenticated) {
      const authToken = this.authService.getToken();
      headers = headers.set("Authorization", "Bearer " + authToken);
      save = '/save';
    }
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/patterns/calculate${save}`, values, {headers: headers}).subscribe(res => {
      console.log(res);
      this.calcValues = res;
      this.resFields = this.resFields.map(el => {
        el.res = res[el.name];
        return el;
      });
      console.log(this.resFields);
      this.resFieldsListener.next(this.resFields);
    });
  }

}
