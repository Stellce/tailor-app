import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "./order.model";
import {OrdersService} from "../orders.service";
import {Subscription} from "rxjs";
import {User} from "../../user.model";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy{
  order: Order;
  orderSub: Subscription;
  changeStateTo: string;
  user: User;
  userSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['orderId'];
      this.orderSub = this.ordersService.getOrderListener().subscribe(order => {
        this.order = order;
      })
      this.ordersService.getOrderById(orderId);
    })
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => this.user = user);
  }

  onAssignOrder(orderId: string) {
    this.ordersService.assignOrder(orderId);
    this.ordersService.getOrders();
    this.backToTable();
  }
  onFinishOrder(orderId: string) {
    this.ordersService.finishOrder(orderId);
    this.ordersService.getOrders();
    this.backToTable();
  }

  onCancelOrder(orderId: string) {
    this.ordersService.cancelOrder(orderId);
    this.ordersService.getOrders();
    this.backToTable();
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe()
  }

  private backToTable() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent})
  }

}
