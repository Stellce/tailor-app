import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category} from "./category.model";
import {environment} from "../environments/environment";
import {Subject} from "rxjs";
import {Model} from "./categories/category/category-model.model";

@Injectable({providedIn: 'root'})
export class AppService {
  backendUrl = environment.backendUrl;
  categoriesListener = new Subject<Category[]>();
  categories: Category[] = <Category[]>[];
  constructor(private http: HttpClient) {}

  getModels() {
    this.http.get<Model[]>(`${this.backendUrl}/coat-models`).subscribe(modelsResponse => {
      let areCached = this.categories.length > 0 && this.categories.every(category => category.models.length === 4);
      if (areCached) return this.categoriesListener.next(this.categories);
      this.categories = [
        {
          coatType: 'JACKET_COAT',
          text: 'Пальто піджак',
          models: <Model[]>[]
        },
        {
          coatType: 'MIDI_COAT',
          text: 'Пальто міді',
          models: <Model[]>[]
        },
        {
          coatType: 'MAXI_COAT',
          text: 'Пальто максі',
          models: <Model[]>[]
        }
      ]
      modelsResponse.forEach(model =>
        this.categories.find(category =>
          category.coatType === model.coatType)?.models.push(model));
      this.categoriesListener.next(this.categories);
    });
  }
}
