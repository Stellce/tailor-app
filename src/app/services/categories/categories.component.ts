import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Category} from "./category/category.model";
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "../../account/orders/orders.service";
import {CategoriesService} from "./categories.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy{
  @Input()isCategoryHidden: boolean = false;
  categoriesSub: Subscription;
  categories: Category[];
  selectedCategory: Category;
  imageInterval: any;
  categoryIndex: number = 0;
  url: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}
  ngOnInit() {
    this.categoriesSub = this.categoriesService.getCategoriesListener().subscribe(categories => {
      console.log(categories)
      this.categories = categories;
      this.url = this.activatedRoute.snapshot.url
        .map(el => el.path)
        .filter(path =>
          !this.categories.some(el => el.coatType.toLowerCase() == path)
        ).join("");
      if(!this.selectedCategory) this.selectedCategory = this.categories?.find(category => category.coatType === 'midi_coat')!;
    }
    );
    this.activatedRoute.params.subscribe(params => {
      this.selectedCategory = this.categories?.find(category => category.coatType === params['category'])!;
    })
    this.categoriesService.requestCategories();
    this.updateImageIndex();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.categoriesService.setSelectedCategory(category);
  }

  getCategoryImage(category: Category) {
    return category.models[this.categoryIndex]?.image || '';
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
    clearInterval(this.imageInterval);
  }

  private updateImageIndex() {
    this.imageInterval = setInterval(() => {
      this.categoryIndex = this.categoryIndex >= this.categories?.length-1 ? 0 : this.categoryIndex += 1;
    }, 5000);
  }

}
