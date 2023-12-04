import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "./order/order.model";
import {OrdersService} from "./orders.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {User} from "../user.model";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  // orders: Order[];
  ordersByStatuses: {status: string, orders: Order[]}[];
  displayedOrders: Order[] | null;
  ordersSub: Subscription;
  displayedColumns: string[] = ['pos', 'name', 'date', 'price'];
  selectedState: string = 'PENDING';
  states: {name: string, text: string}[] = [
    {name: 'PENDING', text: 'Очiкується'},
    {name: 'IN_PROGRESS', text: 'Виробляється'},
    {name: 'COMPLETED', text: 'Завершено'},
    {name: 'CANCELLED', text: 'Скасовано'}
  ]
  user: User;
  userSub: Subscription;
  isAdmin: boolean = false;
  isLoading: boolean;

  constructor(private ordersService: OrdersService, private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.setUserUpdater();

    this.activatedRoute.params.subscribe(params => {
     this.selectedState = params['status'].toUpperCase();
      if (this.selectedState !== 'PENDING') return this.ordersService.getAssignedOrders();
      this.ordersService.getAllUnassignedOrders();
    })

    this.ordersSub = this.ordersService.getOrdersListener().subscribe(orders => {
      console.log('orders')
      console.log(orders)
      this.filterOrdersByStatuses(orders);
      console.log('ordersByStatuses')
      console.log(this.ordersByStatuses);
      this.updateTable();
    })
    if(this.selectedState !== 'PENDING') return this.ordersService.getAssignedOrders();
    this.ordersService.getAllUnassignedOrders();
  }
  onCheckStates() {
    this.displayedOrders = null;
    this.router.navigate(['/', 'orders', this.selectedState.toLowerCase()])
    this.updateTable();
  }
  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }

  private setUserUpdater() {
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
      if(user.roles?.includes('ADMIN')) this.isAdmin = true;
    })
    this.isAdmin = !!this.user.roles?.includes('ADMIN');
  }

  private filterOrdersByStatuses(orders: Order[]) {
    this.ordersByStatuses = [
      {status: 'PENDING', orders: []},
      {status: 'IN_PROGRESS', orders: []},
      {status: 'COMPLETED', orders: []},
      {status: 'CANCELLED', orders: []}
    ]
    orders.forEach(order =>
      this.ordersByStatuses.find(ordersByStatus =>
        ordersByStatus.status === order.status)?.orders!.push(order));
    this.ordersByStatuses = this.ordersByStatuses.map(ordersByStatus => {
      ordersByStatus.orders = ordersByStatus.orders.map((order, index) => {
        order.num = index + 1;
        return order;
      })
      return ordersByStatus;
    })
  }

  private updateTable() {
    // this.displayedOrders = this.orders?.filter(orders => orders.status === this.selectedState)!
    console.log('selectedstate')
    console.log(this.selectedState)
    this.displayedOrders = this.ordersByStatuses.find(ordersByStatus => ordersByStatus.status === this.selectedState)?.orders!;
    console.log('displayedOrders');
    console.log(this.displayedOrders);
  }
}
