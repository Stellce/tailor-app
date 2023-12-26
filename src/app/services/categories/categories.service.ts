import {Injectable} from "@angular/core";
import {Category} from "./category/category.model";
import {Model} from "./category/category-model.model";
import {Order} from "../../account/orders/order/order.model";
import {Subject} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../auth/error-dialog/error-dialog.component";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private backendUrl: string = environment.backendUrl;
  private categories: Category[] = [
    {
      coatType: 'JACKET_COAT',
      text: 'Пальто піджак',
      models: <Model[]>[],
      orders: <Order[]>[]
    },
    {
      coatType: 'MIDI_COAT',
      text: 'Пальто міді',
      models: <Model[]>[],
      orders: <Order[]>[]
    },
    {
      coatType: 'MAXI_COAT',
      text: 'Пальто максі',
      models: <Model[]>[],
      orders: <Order[]>[]
    }
  ];
  private selectedCategory: Category;
  private categoriesListener = new Subject<Category[]>();
  private selectedCategoryNameListener = new Subject<string>();

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  setSelectedCategory(category: Category) {
    this.selectedCategory = category;
    this.selectedCategoryNameListener.next(category.coatType);
  }
  getSelectedCategory() {
    return this.selectedCategory;
  }
  getSelectedCategoryNameListener() {
    return this.selectedCategoryNameListener.asObservable();
  }
  getCategories() {
    return this.categories;
  }
  getCategoriesListener() {
    return this.categoriesListener.asObservable();
  }

  requestCategories(amendCached?: boolean) {
    const areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
    if (areCached && !amendCached) return this.categoriesListener.next(this.categories);
    this.http.get<Model[]>(`${this.backendUrl}/coat-models`).subscribe({
      next: modelsResponse => {
        const areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
        if (areCached && !amendCached) return this.categoriesListener.next(this.categories);
        this.resetCategories();
        modelsResponse.forEach(model =>
          this.categories.find(category =>
            category.coatType === model.coatType && !category.models.some(m => m === model ))?.models?.push(model));
        this.categoriesListener.next(this.categories);
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}});
      }
    });
  }

  private resetCategories() {
    this.categories = [
      {
        coatType: 'JACKET_COAT',
        text: 'Пальто піджак',
        models: <Model[]>[],
        orders: <Order[]>[]
      },
      {
        coatType: 'MIDI_COAT',
        text: 'Пальто міді',
        models: <Model[]>[],
        orders: <Order[]>[]
      },
      {
        coatType: 'MAXI_COAT',
        text: 'Пальто максі',
        models: <Model[]>[],
        orders: <Order[]>[]
      }
    ];
  }
}
