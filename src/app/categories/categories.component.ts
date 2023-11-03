import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AppService} from "../app.service";
import {Category} from "../category.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy{
  categoriesSub: Subscription;
  categories: Category[] = <Category[]> [];
  selectedCategory: Category = <Category> {coatType: ''};
  imageInterval: any;
  categoryIndex: number = 0;

  constructor(private appService: AppService, private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.categoriesSub = this.appService.categoriesListener.subscribe(
      categories => {
        this.categories = categories;
        this.activatedRoute.params.subscribe(route => {
          this.selectedCategory = this.categories.find(category => category.coatType === route['category'])!;
        })
      }
    );
    this.appService.getModels();
    this.updateImageIndex();
    // this.appService.fakeGetCategories();
  }

  scrollToCategory(categoryPath: string) {
    this.router.navigate(['/', 'categories', categoryPath])
  }

  updateImageIndex() {
    this.imageInterval = setInterval(() => {
      this.categoryIndex = this.categoryIndex >= this.categories.length-1 ? 0 : this.categoryIndex += 1;
    }, 5000);
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
    clearInterval(this.imageInterval);
  }

}
