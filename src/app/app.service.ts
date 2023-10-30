import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category} from "./category.model";
import {environment} from "../environments/environment";
import {Subject} from "rxjs";
import * as fakeResponse from "./fakeResponse.json"
import {clothesResponse} from "./categoriesResponse.model";

@Injectable({providedIn: 'root'})
export class AppService {
  backendUrl = environment.backendUrl;
  clothesListener = new Subject<Category[]>();
  categories: Category[] = [
    {
      path: 'jacketCoat',
      dbPath: 'JACKET_COAT',
      text: 'Пальто піджак',
      images: []
    },
    {
      path: 'midiCoat',
      dbPath: 'MIDI_COAT',
      text: 'Пальто міді',
      images: []
    },
    {
      path: 'maxiCoat',
      dbPath: 'MAXI_COAT',
      text: 'Пальто халат',
      images: []
    }
  ]
  constructor(private http: HttpClient) {}

  getCategories() {
    this.http.get<clothesResponse[]>(`${this.backendUrl}/homepage/images`).subscribe(clothesResponse => {
      clothesResponse.forEach(clothesEl => {
        this.categories.find(category => category.dbPath === clothesEl.coatType)?.images.push(clothesEl.image);
      })
      console.log(this.categories)
      this.clothesListener.next(this.categories);
      console.log(this.categories);
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
