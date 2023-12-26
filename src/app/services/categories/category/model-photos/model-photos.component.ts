import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {OrdersService} from "../../../../account/orders/orders.service";
import {PhotoByOrderId} from "./photosByOrderId.model";
import {CalculatorService} from "../../../calculator/calculator.service";
import {ModelsService} from "../models.service";
import {Order} from "../../../../account/orders/order/order.model";

@Component({
  selector: 'app-model-photos',
  templateUrl: './model-photos.component.html',
  styleUrl: './model-photos.component.scss'
})
export class ModelPhotosComponent implements OnInit, OnDestroy{
  @Input() modelId: string;
  @Input() isClickable: boolean;
  @Input() order: Order;
  photosById: PhotoByOrderId[] | null;
  photosSub: Subscription;
  selectedPhotoId: string;
  columnsNum: number;
  orderPhotoSub: Subscription;

  constructor(private ordersService: OrdersService, private calcService: CalculatorService, private modelsService: ModelsService) {}

  ngOnInit() {
    this.photosById = null;
    if(this.isClickable === undefined) this.isClickable = true;
    if(this.order?.id) {
      this.orderPhotoSub = this.ordersService.getOrderPhotoListener().subscribe(photo => {
        if(!photo) return this.photosById = [] as PhotoByOrderId[];
        this.photosById = [{orderId: this.order.id, photo: photo}]
      });
      this.ordersService.requestOrderPhoto(this.order);
    } else {
      this.photosSub = this.modelsService.getModelPhotosListener().subscribe(photosById => {
        this.photosById = photosById;
        this.columnsNum = this.findDivision();
      })
      this.modelsService.requestModelPhotos(this.modelId);
    }
    this.selectedPhotoId = '';
    this.ordersService.getOrderMetricsListener().subscribe(metrics => this.calcService.calculate(metrics));
  }
  onShowCalculations(orderId: string) {
    if(!this.isClickable) return;
    if(this.selectedPhotoId === orderId) return this.onClickOutside();
    this.selectedPhotoId = orderId;
    this.ordersService.requestProductMetricsByOrderId(orderId);
    this.calcService.isEditableEmitter(false);
  }
  onClickOutside() {
    this.selectedPhotoId = '';
    this.calcService.isEditableEmitter(true);
  }
  ngOnDestroy() {
    this.photosSub?.unsubscribe();
    this.orderPhotoSub?.unsubscribe();
    this.photosById = null;
  }
  private findDivision() {
    let len = this.photosById.length;
    return len % 4 == 0 ? 4 :
      len % 3 == 0 ? 3 : 2;
  }
}
