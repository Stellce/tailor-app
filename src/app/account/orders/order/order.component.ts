import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "./order.model";
import {OrdersService} from "../orders.service";
import {Subscription} from "rxjs";
import {User} from "../../user.model";
import {AuthService} from "../../../auth/auth.service";
import {PhotoByOrderId} from "../../../services/categories/category/model-photos/photosById.model";
import {ModelsService} from "../../../services/categories/category/models.service";

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
  photos: PhotoByOrderId[];
  orderPhotosSub: Subscription;
  isEmployee: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
    private authService: AuthService,
    private modelsService: ModelsService
  ) {}
  ngOnInit() {
    this.isEmployee = false;
    this.activatedRoute.params.subscribe(params => {
      let orderId = params['orderId'];
      this.ordersService.requestProductMetricsByOrderId(orderId);
      this.modelsService.requestModelPhotos(orderId);
    })
    this.orderSub = this.ordersService.getOrderListener().subscribe(order => {
      this.order = order;
      this.modelsService.requestModelPhotos(this.order['coatModel'].id);
    })
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user
      this.isEmployee = this.checkIsEmployee(user);
    });
    this.user = this.authService.getUser();
    this.isEmployee = this.checkIsEmployee(this.user);
    this.orderPhotosSub = this.modelsService.getModelPhotosListener().subscribe(photos => {
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
    this.image = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(this.image);
  }
  onSavePhoto() {
    this.ordersService.addPhotoToOrder(this.order, this.image);
  }
  ngOnDestroy() {
    this.orderSub.unsubscribe();
  }
  private backToTable() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
  private checkIsEmployee(user: User) {
    return user.roles?.some(role => ['ADMIN', 'EMPLOYEE'].includes(role))|| false
  }
}
