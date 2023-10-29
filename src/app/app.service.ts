import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category} from "./categories.model";
import {environment} from "../environments/environment";
import {Subject} from "rxjs";
import * as fakeResponse from "./fakeResponse.json"
import {CategoriesResponse} from "./categoriesResponse.model";

@Injectable({providedIn: 'root'})
export class AppService {
  backendUrl = environment.backendUrl;
  categoriesListener = new Subject<Category[]>();
  categories: Category[];
  constructor(private http: HttpClient) {}

  getCategories() {
    this.http.get<CategoriesResponse>(`${this.backendUrl}/homepage/images`).subscribe(categoriesResponse => {
      this.categories = [
        {
          path: 'jacketCoat',
          name: 'Пальто піджак',
          images: []
        },
        {
          path: 'midiCoat',
          name: 'Пальто міді',
          images: []
        },
        {
          path: 'maxiCoat',
          name: 'Пальто халат',
          images: []
        }
      ]
      let categoriesImages = Object.entries(categoriesResponse);
      for(let i = 0; i < this.categories.length ;i++) {
        this.categories[i].images = categoriesImages[i][1];
      }
      this.categoriesListener.next(this.categories);
    });
  }

  // fakeGetCategories() {
  //   let response = new Promise((resolve, reject) => {
  //     let categories = Object.keys(fakeResponse);
  //     this.categories = categories;
  //     this.categoriesListener.next(categories);
  //   })
  // }
}
