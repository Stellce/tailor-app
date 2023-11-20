import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {Category} from "./category/category.model";
import {ActivatedRoute, RouterLinkActive} from "@angular/router";
import {AccountService} from "../account/account.service";
import {OrdersService} from "../account/orders/orders.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy{
  categoriesSub: Subscription;
  categories: Category[];
  selectedCategory: Category;
  imageInterval: any;
  categoryIndex: number = 0;
  url: string;
  isFstClick: boolean = true;

  constructor(
    private ordersService: OrdersService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.categoriesSub = this.ordersService.getCategoriesListener().subscribe(categories => {
      this.categories = categories;
      this.activatedRoute.params.subscribe(route => {
        this.selectedCategory = this.categories.find(category => category.coatType === route['category'])!;
      })
      this.url = this.activatedRoute.snapshot.url
        .map(el => el.path)
        .filter(path =>
          !this.categories.some(el => {
            console.log(path, el.coatType.toLowerCase())
            return el.coatType.toLowerCase() == path
          })
        ).join("");
      }
    );
    this.ordersService.getCategories();
    this.updateImageIndex();
  }

  scrollToCategory(category: Category) {
    console.log(['/', this.url, category.coatType.toLowerCase()].join("/"));
    console.log(this.url)
    this.selectedCategory = category;
  }

  updateImageIndex() {
    this.imageInterval = setInterval(() => {
      this.categoryIndex = this.categoryIndex >= this.categories.length-1 ? 0 : this.categoryIndex += 1;
    }, 5000);
  }

  getCategoryImage(category: Category) {
    return category.models[this.categoryIndex]?.image || '';
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
    clearInterval(this.imageInterval);
  }

}
