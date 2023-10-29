import {Component, EventEmitter, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {InputField} from "../inputField.model";

@Component({
  selector: 'app-calc-fst',
  templateUrl: './calc-fst.component.html',
  styleUrls: ['./calc-fst.component.scss']
})
export class CalcFstComponent {
  inputFields: InputField[] = [
    {name: 'neckSemiCircumference;', text: 'Напiвобхват шиї'},
    {name: 'chestSemiCircumference1;', text:'Напiвобхват грудей перший'},
    {name: 'chestSemiCircumference2;', text: 'Напiвобхват грудей другий'},
    {name: 'chestSemiCircumference3;', text: 'Напiвобхват грудей третiй'},
    {name: 'waistSemiCircumference;', text:'Напiвобхват талiї'},
    {name: 'shoulderWidth;', text: 'Ширина плечового схилу'},
    {name: 'chestHeight; (from the point of the base of the neck)', text:'Висота грудей перша (вiд точки основи шиї)'},
    {name: 'chestHeight1', text: 'Висота грудей (вiд шийної точки)'},
    {name: 'backArmholeHeight;', text: 'Висота пройми ззаду'},
    {name: 'backLengthTillWaist;', text: 'Довжина спини до талiї'},
    {name: 'shoulderHeightSidelong', text: 'Висота плеча коса (для контролю)'},
    {name: 'chestWidth', text: 'Ширина грудей'},
    {name: 'chestCenter', text: 'Центр грудей'},
    {name: 'backWidth', text: 'Ширина спини'},
    {name: 'waistLengthFront', text: 'Довжина талiї переду'},
    {name: 'neckBaseToFrontWaistLineDistance', text: 'Вiдстань вiд точки основи шиї лiнiї талiї спереду'}
  ]
  @Output()firstFormFilled = new EventEmitter<boolean>();

  fstCalc(f: NgForm) {
    if(f.invalid) return;
    this.firstFormFilled.next(true);
  }
}
