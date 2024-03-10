import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "../orders.service";
import {Category} from "../../../services/categories/category/category.model";
import {CategoriesService} from "../../../services/categories/categories.service";
import {ShortOrder} from "../order/short-order.model";

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit, OnDestroy{
  categories: Category[];
  categoriesSub: Subscription;
  tableData: ShortOrder[] = <ShortOrder[]>[];
  displayedColumns = ['pos', 'name', 'date', 'price'];
  coatType: string;

  constructor(
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.categoriesSub = this.categoriesService.getCategoriesListener().subscribe(categories => {
      this.categories = categories;

      this.activatedRoute.url.subscribe(url => {
        this.coatType = url[0].path.toUpperCase();
        this.tableData = this.categories.find(category => category.coatType === this.coatType)?.orders.filter(order => order.status !== 'CANCELLED') || [];
      })
      this.categories.map(category => {
        category.orders = this.ordersService.fixShortOrdersDate(category.orders);
        return category;
      })
    })
    this.ordersService.requestAssignedOrders();
  }
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
