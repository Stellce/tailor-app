import {Injectable} from '@angular/core';
import {Model} from "../../categories/category/category-model.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {environment} from "../../../environments/environment";
import {Order} from "./order.model";
import {Subject} from "rxjs";
import {Category} from "../../categories/category/category.model";
import {ProductMetrics} from "../../categories/category/calculator/product-metrics.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  backendUrl: string = environment.backendUrl;
  modelId: number;
  productMetrics: ProductMetrics;
  orderListener = new Subject<Order>();
  categories: Category[] = [
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
  categoriesListener = new Subject<Category[]>();
  constructor(private authService: AuthService, private http: HttpClient) { }

  getOrderListener() {
    return this.orderListener.asObservable();
  }
  getCategoriesListener() {
    return this.categoriesListener.asObservable();
  }

  getCategories() {
    let areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
    if (areCached) return this.categoriesListener.next(this.categories);
    this.http.get<Model[]>(`${this.backendUrl}/coat-models`).subscribe(modelsResponse => {
      let areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
      if (areCached) return this.categoriesListener.next(this.categories);
      modelsResponse.forEach(model =>
        this.categories.find(category =>
          category.coatType === model.coatType && !category.models.some(m => m === model ))?.models?.push(model));
      this.categoriesListener.next(this.categories);
    });
  }

  selectModel(model: Model) {
    this.modelId = model.id;
  }

  createOrder(productMetrics:  ProductMetrics) {
    this.productMetrics = {...productMetrics};
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    let order = {
      coatModelId: this.modelId,
      productMetrics: {
        clientMetrics: {...productMetrics.clientMetrics},
        ...productMetrics.increases
      }
    }
    console.log(order)
    headers = headers.set("Authorization", "Bearer " + authToken);
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/orders`, order, {headers: headers}).subscribe(res => {
      console.log(res);
    });
  }

  getOrders() {
    let token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    this.http.get<Order[]>(this.backendUrl + '/orders', {headers: headers}).subscribe({
      next: (orders) => {
        orders = orders.map((order) => {
          order.createdAt = new Date(order.createdAt).toLocaleString('en-GB', {
            hour12: false
          });
          return order;
        })
        this.categories.forEach(category => category.orders = []);
        orders.forEach(order =>
          this.categories.find(category =>
            category.coatType === order.coatModel.coatType)?.orders.push(order));
        this.categories = this.categories.map(category => {
          category.orders = category.orders.map((order, index) => {
            order.num = index + 1;
            return order;
          })
          return category
        })
        this.categoriesListener.next(this.categories);
      },
      error: (error) => console.log(error)
    })
  }

  getOrderById(id: number) {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + authToken);
    this.http.get<Order>(`${this.backendUrl}/orders/${id}`, {headers: headers}).subscribe(order => {
      this.orderListener.next(order);
    })
  }
}
