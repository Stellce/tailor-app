import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
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
  selectedCategory: string;
  selectedCategoryImages: string[] = [];

  imageInterval: any;

  categoryImageIndex: number = 0;

  constructor(private appService: AppService, private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.categoriesSub = this.appService.clothesListener.subscribe(
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
    this.updateImageIndex();
    // this.appService.fakeGetCategories();
  }

  scrollToCategory(categoryPath: string) {
    this.router.navigate(['/', 'categories', categoryPath], {fragment: "categoryTarget"})
  }

  updateImageIndex() {
    this.imageInterval = setInterval(() => {
      this.categoryImageIndex = this.categoryImageIndex >= this.categories[0].images.length-1 ? 0 : this.categoryImageIndex += 1;
    }, 5000);
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
    clearInterval(this.imageInterval);
  }


  protected readonly Object = Object;
}
