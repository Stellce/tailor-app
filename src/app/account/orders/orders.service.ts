import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {environment} from "../../../environments/environment";
import {Order} from "./order/order.model";
import {Subject} from "rxjs";
import {ProductMetrics} from "../../services/calculator/product-metrics.model";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../auth/error-dialog/error-dialog.component";
import {NewCustomer} from "./new-customer.model";
import {PhotoByOrderId} from "../../services/categories/category/model-photos/photosByOrderId.model";
import {ModelsService} from "../../services/categories/category/models.service";
import {CategoriesService} from "../../services/categories/categories.service";
import {AppService} from "../../app.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private backendUrl: string = environment.backendUrl;
  private assignedOrders: Order[];
  private unassignedOrders: Order[];
  private orderListener = new Subject<Order>();
  private ordersListener = new Subject<Order[]>();
  private orderPhotoListener = new Subject<string>();
  private orderMetricsListener = new Subject<ProductMetrics>();
  private newCustomerDataListener = new Subject<NewCustomer>();
  private isLoadingListener = new Subject<boolean>();
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private dialog: MatDialog,
    private categoriesService: CategoriesService,
    private modelsService: ModelsService,
    private appService: AppService
  ) { }
  getAssignedOrders() {
    return this.assignedOrders;
  }
  getOrderPhotoListener() {
    return this.orderPhotoListener.asObservable();
  }
  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }
  getNewCustomerDataListener() {
    return this.newCustomerDataListener.asObservable();
  }
  getOrderListener() {
    return this.orderListener.asObservable();
  }
  getOrderMetricsListener() {
    return this.orderMetricsListener.asObservable();
  }
  getOrdersListener() {
    return this.ordersListener.asObservable();
  }

  requestAssignedOrders() {
    this.isLoadingListener.next(true);
    this.http.get<Order[]>(this.backendUrl + '/orders', {headers: this.authService.getTokenHeader()}).subscribe({
      next: (orders) => {
        orders = this.fixOrdersDate(orders);
        this.assignedOrders = orders;
        this.ordersListener.next(orders);
        this.addOrdersToCategories(orders);
        this.categoriesService.requestCategories();
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  requestAllUnassignedOrders() {
    this.isLoadingListener.next(true);
    this.http.get<Order[]>(`${this.backendUrl}/orders/unassigned`, {headers: this.authService.getTokenHeader()}).subscribe( {
      next: (orders) => {
        orders = this.fixOrdersDate(orders);
        this.unassignedOrders = orders;
        this.ordersListener.next(orders);
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  createOrder(productMetrics:  ProductMetrics, clientId?: string) {
    if(!this.authService.getToken()) return;
    const order = {
      clientId: clientId || '',
      coatModelId: this.modelsService.getSelectedModel().id,
      productMetrics: productMetrics
    }
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/orders`, order, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Замовлення створено', isSuccessful: true}})
      },
      error: () => this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}})
    });
  }
  requestOrderById(orderId: string) {
    try {
      let order =
        this.assignedOrders?.find(order => order.id === orderId && order['patternData']) ||
        this.unassignedOrders?.find(order => order.id === orderId && order['patternData']);
      if(order) return this.orderListener.next(order);
    } catch (e) {}
    this.http.get<Order>(`${this.backendUrl}/orders/${orderId}`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: (order) => {
        this.orderListener.next(order);
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  requestProductMetricsByOrderId(orderId: string) {
    this.http.get<ProductMetrics>(`${this.backendUrl}/orders/${orderId}/metrics`).subscribe({
      next: (productMetrics) => {
        this.orderMetricsListener.next(productMetrics);
      }
    })
  }
  assignOrder(order: Order) {
    this.isLoadingListener.next(true);
    this.http.patch(`${this.backendUrl}/orders/assign/${order.id}`, {}, {headers: this.authService.getTokenHeader()}).subscribe({
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
    this.isLoadingListener.next(true);
    this.http.patch(`${this.backendUrl}/orders/${order.id}/completed`, {}, {headers: this.authService.getTokenHeader()}).subscribe({
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
    this.isLoadingListener.next(true);
    this.http.patch(`${this.backendUrl}/orders/${order.id}/cancel`, {}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.requestAssignedOrders();
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Замовлення скасовано', isSuccessful: true}})
      },
      error: (err) => {
        this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}});
        console.log(err);
      }
    })
  }
  createNewCustomer(newCustomer: NewCustomer) {
    this.http.post<NewCustomer>(`${this.backendUrl}/clients/register`, {...newCustomer}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: (customer) => {
        this.newCustomerDataListener.next(customer);
      },
      error: () => {
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  addPhotoToOrder(order: Order, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.http.patch(`${this.backendUrl}/orders/${order.id}/image`, formData, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.requestOrderPhoto(order);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Фото додано', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}});
      }
    })
  }
  removePhotoFromOrder(orderId: string) {
    this.http.delete(`${this.backendUrl}/orders/${orderId}/image`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.requestOrderById(orderId);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Фото усунено', isSuccessful: true}});
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  requestOrderPhoto(order: Order) {
    if(order.status !== 'COMPLETED') return;
    let orderId = order.id;
    let cachedOrder: Order = this.assignedOrders?.find(order => order.id === orderId && order.status === 'COMPLETED');
    if(cachedOrder && cachedOrder['image']) return this.orderPhotoListener.next(cachedOrder['image']);
    this.http.get(`${this.backendUrl}/orders/${orderId}/image`, {responseType: "text", headers: this.authService.getTokenHeader()}).subscribe({
      next: (photo) => {
        order.image = photo;
        this.orderPhotoListener.next(photo);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  fixOrdersDate(orders: Order[]) {
    return orders.map(order => ({...order, createdAt: this.appService.fixDateStr(order.createdAt)}))
  }

  private getOrdersOnStatus(orderStatus: string) {
    if(orderStatus === 'PENDING') {
      this.requestAllUnassignedOrders();
    } else {
      this.requestAssignedOrders();
    }
  }

  private addOrdersToCategories(orders: Order[]) {
    orders = JSON.parse(JSON.stringify(orders));
    this.categoriesService.getCategories().forEach(category => category.orders = []);
    orders.forEach(order =>
      this.categoriesService.getCategories().find(category =>
        category.coatType === order.coatModel.coatType)?.orders.push(order));
  }

  base64ToFile(base64: string) {
    const imageName = 'name.png';
    const imageBlob = dataURItoBlob(base64);
    const file = new File([imageBlob], imageName, { type: 'image/png' });
    function dataURItoBlob(dataURI: any) {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/png' });
      return blob;
    }
    return file
  }

}
