import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Order} from "../../../orders/order.model";
import {OrdersService} from "../../../orders/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy{
  order: Order;
  orderSub: Subscription;
  changeStateTo: string;
  constructor(private activatedRoute: ActivatedRoute, private ordersService: OrdersService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['orderId'];
      this.orderSub = this.ordersService.getOrderListener().subscribe(order => {
        this.order = order;
      })
      this.ordersService.getOrderById(orderId)
    })
  }

  onAssignOrder(orderId: string) {
    this.ordersService.assignOrder(orderId);
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe()
  }

}
