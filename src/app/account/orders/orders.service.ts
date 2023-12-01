import {Injectable} from '@angular/core';
import {Model} from "../../categories/category/category-model.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {environment} from "../../../environments/environment";
import {Order} from "./order/order.model";
import {Subject} from "rxjs";
import {Category} from "../../categories/category/category.model";
import {ProductMetrics} from "../../categories/category/calculator/product-metrics.model";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../auth/error-dialog/error-dialog.component";
import {NewCustomer} from "./new-customer.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  backendUrl: string = environment.backendUrl;
  modelId: number;
  productMetrics: ProductMetrics;
  orderListener = new Subject<Order>();
  ordersListener = new Subject<Order[]>();
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
  newCustomerDataListener = new Subject<NewCustomer>();

  constructor(private authService: AuthService, private http: HttpClient, private dialog: MatDialog) { }


  getNewCustomerDataListener() {
    return this.newCustomerDataListener.asObservable();
  }
  getOrderListener() {
    return this.orderListener.asObservable();
  }
  getOrdersListener() {
    return this.ordersListener.asObservable();
  }
  getCategoriesListener() {
    return this.categoriesListener.asObservable();
  }

  getCategories() {
    let areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
    if (areCached) return this.categoriesListener.next(this.categories);
    this.http.get<Model[]>(`${this.backendUrl}/coat-models`).subscribe({
      next: modelsResponse => {
        let areCached = this.categories.length > 0 && this.categories.every(category => category.models.length > 0);
        if (areCached) return this.categoriesListener.next(this.categories);
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

  selectModel(model: Model) {
    this.modelId = model.id;
  }

  createOrder(productMetrics:  ProductMetrics, clientId?: string) {
    this.productMetrics = {...productMetrics};
    let order = {
      clientId: clientId || '',
      coatModelId: this.modelId,
      productMetrics: {
        clientMetrics: {...productMetrics.clientMetrics},
        ...productMetrics.increases
      }
    }
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/orders`, order, {headers: this.getHeader()}).subscribe(res => {
      console.log(res);
    });
  }

  getAssignedOrders() {
    this.http.get<Order[]>(this.backendUrl + '/orders', {headers: this.getHeader()}).subscribe({
      next: (orders) => {
        orders = this.fixOrdersDate(orders);
        this.ordersListener.next(orders);
        this.divideOrdersByCategories(orders);
        this.categoriesListener.next(this.categories);
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }

  getOrderById(id: number) {
    this.http.get<Order>(`${this.backendUrl}/orders/${id}`, {headers: this.getHeader()}).subscribe({
      next: (order) => {
        this.orderListener.next(order);
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }

  getAllUnassignedOrders() {
    this.http.get<Order[]>(`${this.backendUrl}/orders/unassigned`, {headers: this.getHeader()}).subscribe( {
      next: (orders) => {
        orders = this.fixOrdersDate(orders);
        this.ordersListener.next(orders);
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }

  assignOrder(order: Order) {
    this.http.patch(`${this.backendUrl}/orders/assign/${order.id}`, {}, {headers: this.getHeader()}).subscribe({
      next: () => {
        this.getOrdersOnStatus(order.status);
      },
      error: (err) => {
        this.dialog.open(ErrorDialogComponent);
        console.log(err);
      }
    })
  }

  finishOrder(order: Order) {
    this.http.patch(`${this.backendUrl}/orders/${order.id}/completed`, {}, {headers: this.getHeader()}).subscribe({
      next: () => {
        this.getOrdersOnStatus(order.status);
      },
      error: (err) => {
        this.dialog.open(ErrorDialogComponent);
        console.log(err)
      }
    })
  }
  cancelOrder(order: Order) {
    this.http.patch(`${this.backendUrl}/orders/${order.id}/cancel`, {}, {headers: this.getHeader()}).subscribe({
      next: () => {
        this.getOrdersOnStatus(order.status)
      },
      error: (err) => {
        this.dialog.open(ErrorDialogComponent);
        console.log(err)
      }
    })
  }

  createNewCustomer() {
    this.http.post<NewCustomer>(`${this.backendUrl}/clients/register`, {}, {headers: this.getHeader()}).subscribe({
      next: (customer) => {
        this.newCustomerDataListener.next(customer);
      }
    })
  }

  private getOrdersOnStatus(orderStatus: string) {
    if(orderStatus === 'PENDING') {
      this.getAllUnassignedOrders();
    } else {
      this.getAssignedOrders();
    }
  }

  private fixOrdersDate(orders: Order[]) {
    return orders.map((order) => {
      order.createdAt = (order.createdAt as string).replace('T', ' ');
      return order;
    })
  }

  private getHeader() {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    return headers.set("Authorization", "Bearer " + authToken);
  }
  private divideOrdersByCategories(orders: Order[]) {
    orders = JSON.parse(JSON.stringify(orders));
    this.categories.forEach(category => category.orders = []);
    orders.forEach(order =>
      this.categories.find(category =>
        category.coatType === order.coatModel.coatType)?.orders.push(order));
  }
  numberCategories() {
    return this.categories = this.categories.map(category => {
      category.orders = category.orders.map((order, index) => {
        order.num = index + 1;
        return order;
      })
      return category
    })
  }
}
