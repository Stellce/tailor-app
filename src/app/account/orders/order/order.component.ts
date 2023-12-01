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
      this.ordersService.getOrderById(orderId);
    })
    this.orderSub = this.ordersService.getOrderListener().subscribe(order => {
      this.order = order;
    })
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => this.user = user);
  }

  onAssignOrder(order: Order) {
    this.ordersService.assignOrder(order);
    this.backToTable();
  }
  onFinishOrder(order: Order) {
    this.ordersService.finishOrder(order);
    this.backToTable();
  }

  onCancelOrder(order: Order) {
    this.ordersService.cancelOrder(order);
    this.backToTable();
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe()
  }

  private backToTable() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

}
