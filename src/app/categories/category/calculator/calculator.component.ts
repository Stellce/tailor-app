import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {InputField} from "./inputField.model";
import {ViewportScroller} from "@angular/common";
import {AuthService} from "../../../auth/auth.service";
import {CalculatorService} from "./calculator.service";
import {OrdersService} from "../../../account/orders/orders.service";
import {Order} from "../../../account/orders/order.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit{
  fstForm: FormGroup;
  scndForm: FormGroup;
  inputFieldsFst: InputField[];
  inputFieldsScnd: InputField[];
  order: Order;
  values: {[k: string]: number};
  orderId: number;
  formCreated: boolean = false;

  isFstFormFilled: boolean = false;
  i = 0

  constructor(
    private scroller: ViewportScroller,
    private authService: AuthService,
    private calcService: CalculatorService,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.fstForm = new FormGroup({});
    this.scndForm = new FormGroup({});
    this.inputFieldsFst = this.calcService.getInputFieldsFst();
    this.inputFieldsScnd = this.calcService.getInputFieldsScnd();

    this.inputFieldsFst.forEach(field => {
      this.fstForm.addControl(field.name, new FormControl());
    })
    // this.order.patternData[field.name]
    this.inputFieldsScnd.forEach(field => {
      this.scndForm.addControl(field.name, new FormControl());
    })
    // this.order.patternData[field.name]
    this.formCreated = true;

    this.orderId = this.activatedRoute.snapshot.params['orderId'];
    // if(this.orderId) {
    //   this.ordersService.getOrderListener().subscribe(order => {
    //     this.order = order;
    //     Object.entries(order).forEach(([k, v]) => {
    //       if (this.inputFieldsFst.some(field => field.name ===k)) {
    //         this.fstForm.patchValue({k: v})
    //       }
    //     })
    //     // this.fstForm.patchValue(order);
    //     // this.scndForm.patchValue(order);
    //   })
    // }

    // this.activatedRoute.url.subscribe(url => {
    //   if(+url[0].path) {
    //     let modelId = +url[0].path;
    //     this.ordersService.getOrderListener().subscribe(order => {
    //       this.calcService.updateValues(order);
    //       this.inputFieldsFst = this.calcService.getInputFieldsFst();
    //       this.inputFieldsScnd = this.calcService.getInputFieldsScnd();
    //       console.log(order);
    //     })
    //
    //     this.ordersService.getOrderById(modelId);
    //   }
    // })
  }

  calcFstForm() {
    if(this.fstForm.invalid) return;
    this.isFstFormFilled = true;
    let values: {[k: string]: number} = {};
    Object.entries(this.fstForm.controls).forEach(([k, v]) => {
      values[k] = v.value;
    })
    this.values = values;
    console.log(this.values);
    this.scroller.scrollToAnchor('scndCalc');
  }
  calcScndForm() {
    if(this.scndForm.invalid) return;
    let values = {...this.values};
    for(let [k, v] of Object.entries(this.scndForm.controls)) {
      values[k] = v.value;
    }
    this.values = values;
    console.log(this.values);
    console.log(Object.keys(values).length);
    if (this.authService.getIsAuth()) {
      this.ordersService.createOrder(this.values);
    }
    this.calcService.calculate(this.values);
  }

  protected readonly String = String;
}
