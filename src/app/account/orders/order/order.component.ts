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
  user: User;
  userSub: Subscription;
  image: File;
  photoPreview: string;
  photos: string[];
  orderPhotosSub: Subscription;
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
      this.ordersService.getOrderPhotos(this.order['coatModel'].id);
    })
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => this.user = user);
    this.orderPhotosSub = this.ordersService.getOrderPhotosListener().subscribe(photos => {
      this.photos = photos;
    })
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
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSavePhoto() {
    this.ordersService.addPhoto(this.order, this.photoPreview);
  }
  ngOnDestroy() {
    this.orderSub.unsubscribe();
  }
  private backToTable() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
}
