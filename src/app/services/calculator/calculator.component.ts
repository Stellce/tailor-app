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

  constructor(
    private authService: AuthService,
    private calcService: CalculatorService,
    private ordersService: OrdersService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    if(this.isEditable === undefined) this.isEditable = true;

    this.createForm();
    this.fillForm();

    this.isEditableSub = this.calcService.getIsEditableListener().subscribe(isEditable => {
      this.isEditable = isEditable;
      if (isEditable) {
        this.metricsForm.reset();
        this.increasesForm.reset();
      }
    });
  }

  writeClientMetrics() {
    if(this.metricsForm.invalid) return;
    this.isMetricsFormFilled = true;
    let metrics: {[k: string]: number} = {};
    Object.entries(this.metricsForm.controls).forEach(([k, v]) => {
      metrics[k] = v.value;
    })
    this.productMetrics.clientMetrics = metrics;
  }
  calculate() {
    if(this.increasesForm.invalid) return;
    if(this.authService.getUser().roles?.includes('EMPLOYEE' || 'ADMIN')) {
      this.dialog.open(DialogDataComponent);
      this.ordersService.getNewCustomerDataListener().subscribe(newCustomer => {
        this.calcValues(newCustomer.id);
      });
    } else {
      this.calcValues();
    }
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe();
    this.isEditableSub.unsubscribe();
  }

  private calcValues(clientId?: string) {
    let productMetrics: ProductMetrics = {...this.productMetrics};
    for(let [k, v] of Object.entries(this.increasesForm.controls)) {
      productMetrics.increases[k] = v.value;
    }
    this.productMetrics = productMetrics;
    if (this.authService.getUser()) {
      this.ordersService.createOrder(this.productMetrics, clientId);
    }
    this.calcService.calculate(this.productMetrics);
  }

  private createForm() {
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
    });
    this.formCreated = true;
  }

  private fillForm() {
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

}
