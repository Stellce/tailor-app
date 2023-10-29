import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AppService} from "../app.service";
import {Category} from "../categories.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy{
  categoriesSub: Subscription;
  categories: Category[];
  selectedCategory: string;
  selectedCategoryImages: string[] = [];

  constructor(private appService: AppService, private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.categoriesSub = this.appService.categoriesListener.subscribe(
      categories => {
        this.categories = categories;
        console.log(categories);
        this.activatedRoute.params.subscribe(route => {
          this.selectedCategory = route['category'];
          this.selectedCategoryImages = this.categories.find(category => category.path == this.selectedCategory)?.images || [];
          console.log(this.selectedCategory);
        })
      }
    );
    this.appService.getCategories();
    // this.appService.fakeGetCategories();

  }

  scrollToCategory(categoryPath: string) {
    this.router.navigate(['/', 'categories', categoryPath], {fragment: "categoryTarget"})
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }

  getSelectedCategoryImages() {
    if(this.categories) {
      console.log(this.categories.length);
      return this.categories.length > 1 ? this.categories.find(category => category.name == this.selectedCategory)?.images : [];
    }
    return [];
  }

  protected readonly Object = Object;
}
