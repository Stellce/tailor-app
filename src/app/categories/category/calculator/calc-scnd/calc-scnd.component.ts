import {Component, Input, OnInit} from '@angular/core';
import {InputField} from "../inputField.model";
import {NgForm} from "@angular/forms";
import {CalculatorService} from "../calculator.service";

@Component({
  selector: 'app-calc-scnd',
  templateUrl: './calc-scnd.component.html',
  styleUrls: ['./calc-scnd.component.scss']
})
export class CalcScndComponent implements OnInit{
  firstCalcFilled: boolean = false;
  inputFields: InputField[] = [
    {name: 'increaseToWidthByChestLine', text: 'До ширини виробу по лінії грудей'},
    {name: 'increaseToArmholeDepth', text: 'До глибини пройми'},
    {name: 'increaseToNeckBack', text: 'До ширини горловини спинки і пілочки'}
  ];
  constructor(private calcService: CalculatorService) {}

  ngOnInit() {
    this.calcService.firstCalcFilledListener.subscribe(isFilled => {
      this.firstCalcFilled = isFilled;
    })
  }

  scndCalc(f: NgForm) {

    console.log(f.controls);
  }
}
