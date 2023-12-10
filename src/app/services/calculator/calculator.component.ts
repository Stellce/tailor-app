import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {InputField} from "./inputField.model";
import {AuthService} from "../../auth/auth.service";
import {CalculatorService} from "./calculator.service";
import {OrdersService} from "../../account/orders/orders.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogDataComponent} from "../../auth/dialog-data/dialog-data.component";
import {ProductMetrics} from "./product-metrics.model";
import {Subscription} from "rxjs";
import {MetricsService} from "../../account/metrics.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit, OnDestroy{
  @Input()isEditable: boolean;
  isEditableSub: Subscription;
  metricsForm: FormGroup;
  increasesForm: FormGroup;
  inputMetrics: InputField[];
  inputIncreases: InputField[];
  formCreated: boolean = false;
  isMetricsFormFilled: boolean = false;
  orderSub: Subscription;
  patternImgPath: string = '../../../../assets/pattern-image.jpg'

  productMetrics: ProductMetrics;
  wereMetricsRecieved: boolean = false;

  constructor(
    private authService: AuthService,
    private calcService: CalculatorService,
    private ordersService: OrdersService,
    private metricsService: MetricsService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    if(this.isEditable === undefined) this.isEditable = true;

    this.createForm();
    this.setFillerFormByOrderSub();
    this.setFillerFormByUserSub();
    this.metricsService.getMetrics();

    this.isEditableSub = this.calcService.getIsEditableListener().subscribe(isEditable => {
      this.isEditable = isEditable;
      if (isEditable) {
        this.isMetricsFormFilled = false;

        this.metricsForm.reset();
        this.increasesForm.reset();

        this.metricsService.getMetrics();
      }
    });
  }

  toNextForm() {
    if(this.metricsForm.invalid) return;
    this.isMetricsFormFilled = true;
  }
  calculate() {
    if(this.increasesForm.invalid || this.metricsForm.invalid) return;
    this.writeMetrics();
    if(this.authService.getUser().roles?.includes('EMPLOYEE' || 'ADMIN')) {
      this.dialog.open(DialogDataComponent);
      this.ordersService.getNewCustomerDataListener().subscribe(newCustomer => {
        this.calcValues(newCustomer.id);
      });
    } else {
      this.wereMetricsRecieved ?
        this.metricsService.putMetrics(this.productMetrics.clientMetrics) :
        this.metricsService.postMetrics(this.productMetrics.clientMetrics);
      this.calcValues();
    }
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe();
    this.isEditableSub.unsubscribe();
  }

  private calcValues(clientId?: string) {
    if (this.authService.getUser()) {
      this.ordersService.createOrder(this.productMetrics, clientId);
    }
    this.calcService.calculate(this.productMetrics);
  }
  private writeMetrics() {
    if(this.metricsForm.invalid || this.increasesForm.invalid) return;
    let clientMetrics: {[s: string]: number} = {};
    Object.entries(this.metricsForm.controls).forEach(([k, v]) => {
      clientMetrics[k] = v.value;
    })
    this.productMetrics.clientMetrics = clientMetrics;

    let productMetrics: ProductMetrics = {...this.productMetrics};
    for(let [k, v] of Object.entries(this.increasesForm.controls)) {
      let obj: {[s: string]: number} = {}
      obj[k] = v.value;
      productMetrics = {...productMetrics, ...obj};
    }
    this.productMetrics = productMetrics;
  }

  private createForm() {
    this.productMetrics = {
      clientMetrics: {}
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
    });
    this.formCreated = true;
  }

  private setFillerFormByOrderSub() {
    this.orderSub = this.ordersService.getOrderMetricsListener().subscribe(productMetrics => {
      this.isMetricsFormFilled = true;

      Object.entries(productMetrics.clientMetrics).forEach(([k, v]) => {
        if (this.inputMetrics.some(field => field.name ===k)) {
          let obj: {[s: string]: number} = {}
          obj[k] = v;
          this.metricsForm.patchValue(obj)
        }
      })
      Object.entries(productMetrics).forEach(([k, v]) => {
        if(this.inputIncreases.some(field => field.name === k)) {
          let obj: {[s: string]: number} = {};
          obj[k] = v;
          this.increasesForm.patchValue(obj)
        }
      })
    })
  }

  private setFillerFormByUserSub() {
    this.metricsService.getMetricsListener().subscribe(metrics => {
      if(!metrics) return;
      this.wereMetricsRecieved = true;
      this.isMetricsFormFilled = true;

      Object.entries(metrics).forEach(([k, v]) => {
        if (this.inputMetrics.some(field => field.name ===k)) {
          let obj: {[s: string]: number} = {}
          obj[k] = v;
          this.metricsForm.patchValue(obj)
        }
      })
      this.productMetrics.clientMetrics = metrics;
    })
  }

}
