import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "./order.model";
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "./orders.service";
import {Category} from "../../categories/category/category.model";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  categories: Category[];
  categoriesSub: Subscription;
  tableData: Order[] = <Order[]>[];
  displayedColumns = ['pos', 'name', 'date', 'price', 'edit'];
  coatType: string;

  constructor(private ordersService: OrdersService, private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.categoriesSub = this.ordersService.getCategoriesListener().subscribe(categories => {
      this.categories = categories;

      this.activatedRoute.url.subscribe(url => {
        this.coatType = url[0].path.toUpperCase();
        this.tableData = this.categories.find(category => category.coatType === this.coatType)?.orders || [];
      })
    })
    this.ordersService.getOrders();
  }
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
