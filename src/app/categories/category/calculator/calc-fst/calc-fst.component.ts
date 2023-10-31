import {Component, EventEmitter, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {InputField} from "../inputField.model";
import {CalculatorService} from "../calculator.service";

@Component({
  selector: 'app-calc-fst',
  templateUrl: './calc-fst.component.html',
  styleUrls: ['./calc-fst.component.scss']
})
export class CalcFstComponent {
  inputFields: InputField[] = [
    {name: 'neckSemiCircumference', text: 'Напiвобхват шиї'},
    {name: 'chestSemiCircumference1', text:'Напiвобхват грудей перший'},
    {name: 'chestSemiCircumference2', text: 'Напiвобхват грудей другий'},
    {name: 'chestSemiCircumference3', text: 'Напiвобхват грудей третій'},
    {name: 'waistSemiCircumference', text:'Напiвобхват талії'},
    {name: 'shoulderWidth', text: 'Ширина плечового схилу'},
    {name: 'chestHeight', text: 'Висота грудей перша (вiд точки основи шиї)'},
    {name: 'chestHeight1', text: 'Висота грудей (вiд шийної точки)'},
    {name: 'backArmholeHeight;', text: 'Висота пройми ззаду'},
    {name: 'backLengthTillWaist', text: 'Довжина спини до талії'},
    {name: 'shoulderHeightSidelong', text: 'Висота плеча коса (для контролю)'},
    {name: 'chestWidth', text: 'Ширина грудей'},
    {name: 'chestCenter', text: 'Центр грудей'},
    {name: 'backWidth', text: 'Ширина спини'},
    {name: 'waistLengthFront', text: 'Довжина талії переду'},
    {name: 'neckBaseToFrontWaistLineDistance', text: 'Відстань вiд точки основи шиї лінії талії спереду'}
  ]
  constructor(private calcService: CalculatorService) {}

  fstCalc(f: NgForm) {
    if(f.invalid) return;
    this.calcService.firstCalcFilledListener.next(true);
    // let values = f.form.controls.forEach
    let values: {[s: string]: number} = {};
    // console.log(Object.entries(f.form.controls).map((k, value) => {k: value}));
    for(let [k, v] of Object.entries(f.form.controls)) {
      values[k] = v.value;
    }
    console.log(values)

    this.calcService.setFirstCalcValues(values);
  }
}
