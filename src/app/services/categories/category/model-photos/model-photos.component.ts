import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {OrdersService} from "../../../../account/orders/orders.service";
import {PhotoByOrderId} from "./photosById.model";
import {CalculatorService} from "../../../calculator/calculator.service";
import {ModelsService} from "../models.service";

@Component({
  selector: 'app-model-photos',
  templateUrl: './model-photos.component.html',
  styleUrl: './model-photos.component.scss'
})
export class ModelPhotosComponent implements OnInit, OnDestroy{
  @Input() modelId: string;
  @Input() isClickable: boolean;
  @Input() orderId: string;
  photosById: PhotoByOrderId[];
  photosSub: Subscription;
  selectedPhotoId: string;
  nearestDivision: number;

  constructor(private ordersService: OrdersService, private calcService: CalculatorService, private modelsService: ModelsService) {}

  ngOnInit() {
    if(this.isClickable === undefined) this.isClickable = true;
    this.photosSub = this.modelsService.getModelPhotosListener().subscribe(photosById => {
      if(this.orderId) {
        this.photosById = photosById.filter(photoById => photoById.orderId == this.orderId);
      } else {
        this.photosById = photosById;
      }
      this.nearestDivision = this.findDivision();
      this.selectedPhotoId = '';
    })
    this.ordersService.getOrderMetricsListener().subscribe(metrics => this.calcService.calculate(metrics));
    this.modelsService.requestModelPhotos(this.modelId);
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
    this.photosSub.unsubscribe();
  }
  private findDivision() {
    let len = this.photosById.length;
    return len % 4 == 0 ? 4 :
      len % 3 == 0 ? 3 : 2;
  }
}
