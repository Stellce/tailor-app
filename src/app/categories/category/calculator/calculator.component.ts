import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {InputField} from "./inputField.model";
import {ViewportScroller} from "@angular/common";
import {AuthService} from "../../../auth/auth.service";
import {CalculatorService} from "./calculator.service";
import {OrdersService} from "../../../account/orders/orders.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogDataComponent} from "../../../auth/dialog-data/dialog-data.component";
import {ProductMetrics} from "./product-metrics.model";
import {Order} from "../../../account/orders/order.model";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit{
  metricsForm: FormGroup;
  increasesForm: FormGroup;
  inputMetrics: InputField[];
  inputIncreases: InputField[];
  productMetrics: ProductMetrics;
  orderId: number;
  formCreated: boolean = false;
  isMetricsFormFilled: boolean = false;
  patternImgPath: string = '../../../../assets/pattern-image.jpg'
  order: Order;

  constructor(
    private scroller: ViewportScroller,
    private authService: AuthService,
    private calcService: CalculatorService,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.productMetrics = {
      clientMetrics: {},
      increases: {}
    };
    this.metricsForm = new FormGroup({});
    this.increasesForm = new FormGroup({});
    this.inputMetrics = this.calcService.getInputFieldsFst();
    this.inputIncreases = this.calcService.getInputFieldsScnd();

    this.inputMetrics.forEach(field => {
      this.metricsForm.addControl(field.name, new FormControl());
    })
    this.inputIncreases.forEach(field => {
      this.increasesForm.addControl(field.name, new FormControl());
    })
    this.formCreated = true;

    this.orderId = this.activatedRoute.snapshot.params['orderId'];
    if(this.orderId) {
      this.ordersService.getOrderListener().subscribe(order => {
        this.order = order;
        this.isMetricsFormFilled = true;
        Object.entries(order.productMetrics.clientMetrics).forEach(([k, v]) => {
          if (this.inputMetrics.some(field => field.name ===k)) {
            let obj: {[s: string]: number} = {}
            obj[k] = v;
            this.metricsForm.patchValue(obj)
          }
        })
        Object.entries(order.productMetrics).forEach(([k, v]) => {
          if(this.inputIncreases.some(field => field.name === k)) {
            let obj: {[s: string]: number} = {};
            obj[k] = v;
            this.increasesForm.patchValue(obj)
          }
        })
      })
    }
  }

  calcFstForm() {
    if(this.metricsForm.invalid) return;
    this.isMetricsFormFilled = true;
    let metrics: {[k: string]: number} = {};
    Object.entries(this.metricsForm.controls).forEach(([k, v]) => {
      metrics[k] = v.value;
    })
    this.productMetrics.clientMetrics = metrics;
    this.scroller.scrollToAnchor('scndCalc');
  }
  calcScndForm() {
    if(this.increasesForm.invalid) return;
    if(this.authService.getRoles()?.includes('EMPLOYEE')) {
      this.openDialog();
      this.calcService.getisUserDataProvidedListener().subscribe(isProvided => this.calcValues());
    } else {
      this.calcValues();
    }
  }

  private calcValues() {
    let productMetrics: ProductMetrics = {...this.productMetrics};
    for(let [k, v] of Object.entries(this.increasesForm.controls)) {
      productMetrics.increases[k] = v.value;
    }
    this.productMetrics = productMetrics;
    if (this.authService.getUser()) {
      this.ordersService.createOrder(this.productMetrics);
    }
    this.calcService.calculate(this.productMetrics);
  }

  private openDialog() {
    this.dialog.open(DialogDataComponent);
  }

  protected readonly String = String;
}
