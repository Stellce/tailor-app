import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResField} from "../resField.model";
import {Subscription} from "rxjs";
import {CalculatorService} from "../calculator.service";
import {OrdersService} from "../../../account/orders/orders.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-calc-res-fields',
  templateUrl: './calc-res-fields.component.html',
  styleUrl: './calc-res-fields.component.scss'
})
export class CalcResFieldsComponent implements OnInit, OnDestroy{
  resFields: ResField[] = <ResField[]> [];
  resFieldsSub: Subscription;
  ordersSub: Subscription;

  constructor(
    private calcService: CalculatorService,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.resFieldsSub = this.calcService.getResFieldsListener().subscribe(resFields => {
      this.resFields = resFields;
    });
    this.ordersSub = this.ordersService.getOrderListener().subscribe(order => {
      this.calcService.handleCalcValues(order.patternData);
    })
    this.activatedRoute.params.subscribe(params => {
      let modelId = params['orderId'];
      if(modelId) this.ordersService.requestOrderById(modelId);
    })
  }

  ngOnDestroy() {
    this.resFieldsSub.unsubscribe();
    this.ordersSub.unsubscribe();
  }
}
