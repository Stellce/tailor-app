import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Category} from "./category.model";
import {Model} from "./category-model.model";
import {VideoDialogComponent} from "./video-dialog/video-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Params} from "@angular/router";
import {OrdersService} from "../../../account/orders/orders.service";
import {Subscription} from "rxjs";
import {CalculatorService} from "../../calculator/calculator.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy{
  @Input()category: Category;
  @Input()hidden: boolean;
  selectedModel: Model = <Model>{name: ''};
  categorySub: Subscription;
  categories: Category[];
  arePhotosShowen: boolean = false;
  params: Params;

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private calcService: CalculatorService
  ) {}
  ngOnInit() {
    if(this.hidden === undefined) this.hidden = true;

    this.categorySub = this.ordersService.getCategoriesListener().subscribe(categories => {
      this.categories = categories;
      this.findCategory();
    })
    this.activatedRoute.params.subscribe(params => {
      this.params = params;
      console.log(params['category'])
      if(!this.categories) return;
      this.findCategory();
    })
  }

  onModelSelect(model: Model) {
    this.selectedModel = model;
    this.ordersService.selectModel(model);
    this.calcService.isEditableEmitter(true);
    this.ordersService.getModelPhotos(this.selectedModel.id);
  }

  openVideo(videoUrl: string) {
    this.dialog.open(VideoDialogComponent, {data: {videoUrl: videoUrl}});
  }
  onShowPhotos(modelId: string) {
    if(this.selectedModel.id !== modelId) return;
    this.arePhotosShowen = !this.arePhotosShowen;
    if(this.arePhotosShowen) this.ordersService.getModelPhotos(modelId);
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }

  private findCategory() {
    this.category = this.categories.find(category => category.coatType?.toUpperCase() === this.params['category']?.toUpperCase())!
  }

}
