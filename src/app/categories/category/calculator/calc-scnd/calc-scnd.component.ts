import {Component, Input} from '@angular/core';
import {InputField} from "../inputField.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-calc-scnd',
  templateUrl: './calc-scnd.component.html',
  styleUrls: ['./calc-scnd.component.scss']
})
export class CalcScndComponent {
  @Input() firstFormFilled: boolean = false;
  inputFields: InputField[] = [
    {name: ' ', text: ''},
    {name: ' ', text: ''},
    {name: ' ', text: ''}
  ]
  scndCalc(f: NgForm) {

  }
}
