import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {InputField} from "./inputField.model";
import {ViewportScroller} from "@angular/common";
import {AuthService} from "../../../auth/auth.service";
import {CalculatorService} from "./calculator.service";
import {OrdersService} from "../../../account/orders/orders.service";
import {Order} from "../../../account/orders/order.model";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit{
  inputFieldsFst: InputField[];
  inputFieldsScnd: InputField[];
  order: Order;
  values: {[k: string]: number};

  isFstFormFilled: boolean = false;

  constructor(
    private scroller: ViewportScroller,
    private authService: AuthService,
    private calcService: CalculatorService,
    private ordersService: OrdersService
  ) {}
  ngOnInit() {
    this.inputFieldsFst = this.calcService.getInputFieldsFst();
    this.inputFieldsScnd = this.calcService.getInputFieldsScnd();

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

  calcFstForm(f: NgForm) {
    if(f.invalid) return;
    this.isFstFormFilled = true;
    let values: {[k: string]: number} = {};
    Object.entries(f.form.controls).forEach(([k, v]) => {
      values[k] = v.value;
    })
    this.values = values;
    console.log(this.values);
    this.scroller.scrollToAnchor('scndCalc');
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
      this.ordersService.createOrder(this.values);
    }
    this.calcService.calculate(this.values);
  }

  protected readonly String = String;
}
