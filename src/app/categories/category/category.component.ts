import {Component, Input} from '@angular/core';
import {CalculatorService} from "./calculator/calculator.service";
import {InputField} from "./calculator/inputField.model";
import {NgForm} from "@angular/forms";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  @Input() images: string[];
  @Input() selectedCategoryImages: string[];
  isFstFormFilled: boolean = false;
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
  ]
  inputFieldsScnd: InputField[] = [
    {name: 'increaseToWidthByChestLine', text: 'До ширини виробу по лінії грудей'},
    {name: 'increaseToArmholeDepth', text: 'До глибини пройми'},
    {name: 'increaseToNeckBack', text: 'До ширини горловини спинки і пілочки'}
  ];
  values: {[k: string]: number};

  constructor(private calcService: CalculatorService, private scroller: ViewportScroller) {}

  calcFstForm(f: NgForm) {
    if(f.invalid) return;
    this.isFstFormFilled = true;
    let values: {[k: string]: number} = {};
    for(let [k, v] of Object.entries(f.form.controls)) {
      values[k] = v.value;
    }
    this.values = values;
    console.log(this.values);
    this.scroller.scrollToAnchor('scndCalc')
  }
  calcScndForm(f: NgForm) {
    if(f.invalid) return;
    let values = {...this.values};
    for(let [k, v] of Object.entries(f.form.controls)) {
      values[k] = v.value;
    }
    this.values = values;
    console.log(this.values);
    this.calcService.setValues(this.values);
  }

}
