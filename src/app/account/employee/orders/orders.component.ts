import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "../../orders/order.model";
import {OrdersService} from "../../orders/orders.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  orders: Order[];
  ordersByStatuses: {status: string, orders?: Order[]}[];
  displayedOrders: Order[];
  ordersSub: Subscription;
  displayedColumns: string[] = ['pos', 'name', 'date', 'price'];
  selectedState: string = 'PENDING';
  states: {name: string, text: string}[] = [
    {name: 'PENDING', text: 'Очiкується'},
    {name: 'IN_PROGRESS', text: 'Виробляється'},
    {name: 'CLOSED', text: 'Завершено'}
  ]

  constructor(private ordersService: OrdersService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
     this.selectedState = params['status'].toUpperCase();
      console.log(params)
    })
    this.ordersSub = this.ordersService.getOrdersListener().subscribe(orders => {
      this.orders = orders;
      this.ordersByStatuses = [
        {status: 'PENDING'},
        {status: 'IN_PROGRESS'},
        {status: 'CLOSED'}
      ]
      this.orders.forEach((order, index) => order.num = index + 1);
      for(let i = 0; i < this.ordersByStatuses.length; i++) {
        this.ordersByStatuses[i].orders = orders.filter(order => order.status === this.ordersByStatuses[i].status);
      }
      console.log(this.ordersByStatuses)
      this.updateTable();
    })
    this.ordersService.getAllUnassignedOrders();
    console.log('orders created')
  }
  onCheckStates() {
    this.router.navigate(['/', 'orders', this.selectedState.toLowerCase()])
    this.updateTable();
  }
  onAssignOrder(orderId: string) {
    this.ordersService.assignOrder(orderId);
  }
  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }

  private updateTable() {
    this.displayedOrders = this.orders?.filter(orders => orders.status === this.selectedState)!
  }
}
