import {Component, Input, OnInit} from '@angular/core';
import {CalculatorService} from "./calculator/calculator.service";
import {InputField} from "./calculator/inputField.model";
import {NgForm} from "@angular/forms";
import {ViewportScroller} from "@angular/common";
import {ResField} from "./calculator/resField.model";
import {Subscription} from "rxjs";
import {Category} from "../../category.model";
import {Model} from "./category-model.model";
import {AuthService} from "../../auth/auth.service";
import {VideoDialogComponent} from "../video-dialog/video-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit{
  @Input() category: Category;
  selectedModel: Model = <Model>{name: ''};
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
  resFields: ResField[] = <ResField[]> [];
  resFieldsSub: Subscription;

  constructor(private calcService: CalculatorService, private scroller: ViewportScroller, private authService: AuthService, public dialog: MatDialog) {}
  ngOnInit() {
    this.resFieldsSub = this.calcService.resFieldsListener.subscribe(resFields => {
      this.resFields = resFields;
    })
  }

  onModelSelect(model: Model) {
    this.selectedModel = model
  }

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
    console.log(Object.keys(values).length);
    if (this.authService.getIsAuth()) {
      this.calcService.createOrder(this.values, this.selectedModel.id);
    }
    this.calcService.calculate(this.values);
  }

  openDialog() {
    this.dialog.open(VideoDialogComponent);
  }

}
