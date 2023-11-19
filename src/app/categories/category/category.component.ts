import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from "./category.model";
import {Model} from "./category-model.model";
import {VideoDialogComponent} from "../video-dialog/video-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "../../account/orders/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy{
  selectedModel: Model = <Model>{name: ''};
  category: Category;
  categorySub: Subscription;

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.categorySub = this.ordersService.getCategoriesListener().subscribe(categories => {
      this.activatedRoute.params.subscribe(params => {
        this.category = categories.find(category => category.coatType.toUpperCase() === params['category'].toUpperCase())!
      })
    })
    this.ordersService.getCategories();
  }

  onModelSelect(model: Model) {
    this.selectedModel = model;
    this.ordersService.selectModel(model);
  }

  openDialog() {
    this.dialog.open(VideoDialogComponent);
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }

}
