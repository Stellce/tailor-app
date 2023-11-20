import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "../../orders/order.model";
import {OrdersService} from "../../orders/orders.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  orders: Order[];
  ordersSub: Subscription;
  displayedColumns: string[] = ['pos', 'name', 'date', 'price', 'assign'];
  ordersState: string;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersSub = this.ordersService.getOrdersListener().subscribe(orders => {
      this.orders = orders;
      console.log(orders);
    })
    this.ordersService.getAllUnassignedOrders();
  }
  onAssignOrder(orderId: number) {
    this.ordersService.assignOrder(orderId);
  }
  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }
}
