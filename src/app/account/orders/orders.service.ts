import {Injectable} from '@angular/core';
import {Model} from "../../services/categories/category/category-model.model";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {environment} from "../../../environments/environment";
import {Order} from "./order/order.model";
import {Subject} from "rxjs";
import {Category} from "../../services/categories/category/category.model";
import {ProductMetrics} from "../../services/calculator/product-metrics.model";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../auth/error-dialog/error-dialog.component";
import {NewCustomer} from "./new-customer.model";
import {PhotoByOrderId} from "../../services/categories/category/model-photos/photosById.model";
import {ModelsService} from "../../categories/category/models.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  backendUrl: string = environment.backendUrl;
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
  photosByCoatModelId: {coatModelId: string, photosByOrderId: PhotoByOrderId[]}[] = [];
  selectedCategory: Category;

  categoriesListener = new Subject<Category[]>();
  newCustomerDataListener = new Subject<NewCustomer>();
  orderPhotosListener = new Subject<PhotoByOrderId[]>();
  orderMetricsListener = new Subject<ProductMetrics>();
  constructor(private authService: AuthService, private http: HttpClient, private dialog: MatDialog, private modelService: ModelsService) { }

  setSelectedCategory(category: Category) {
    this.selectedCategory = category;
  }
  getSelectedCategory() {
    return this.selectedCategory;
  }
  getCategories() {
    return this.categories;
  }
  getModelPhotosListener() {
    return this.orderPhotosListener.asObservable();
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
  requestAssignedOrders() {
    this.http.get<Order[]>(this.backendUrl + '/orders', {headers: this.authService.getTokenHeader()}).subscribe({
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
  requestAllUnassignedOrders() {
    this.http.get<Order[]>(`${this.backendUrl}/orders/unassigned`, {headers: this.authService.getTokenHeader()}).subscribe( {
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
  createOrder(productMetrics:  ProductMetrics, clientId?: string) {
    this.productMetrics = productMetrics;
    const order = {
      clientId: clientId || '',
      coatModelId: this.modelService.getSelectedModel().id,
      productMetrics: productMetrics
    }
    this.http.post<{[s: string]: string}>(`${this.backendUrl}/orders`, order, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => this.dialog.open(ErrorDialogComponent, {data: {message: 'Замовлення створено', isSuccessful: true}}),
      error: () => this.authService.getToken() ? this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}}) : false
    });
  }
  requestOrderById(id: string) {
    this.http.get<Order>(`${this.backendUrl}/orders/${id}`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: (order) => {
        this.orderListener.next(order);
      },
      error: (err) => {
        console.log(err)
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
        this.requestModelPhotos(order.coatModel.id, true);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Фото додано', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent, {data: {isSuccessful: false}});
      }
    })
  }
  requestModelPhotos(coatModelId: string, isChanged?: boolean) {
    let persists = this.photosByCoatModelId.find(photosByCoatModelId => photosByCoatModelId.coatModelId === coatModelId)
    if(persists && !isChanged) return this.orderPhotosListener.next(persists.photosByOrderId);
    this.http.get<{ [s: string]: string }>(`${this.backendUrl}/coat-models/${coatModelId}/images`).subscribe({
      next: (photos) => {
        let photosByOrderId: PhotoByOrderId[] = [];
        Object.entries(photos).forEach(([id, photo]) => photosByOrderId.push({orderId: id, photo: photo}))
        this.photosByCoatModelId.push({ coatModelId: coatModelId, photosByOrderId:photosByOrderId});
        this.orderPhotosListener.next(photosByOrderId);
      },
      error: () => {}
    })
  }
  createModel(newModel: Model) {
    this.http.post<Model>(`${this.backendUrl}/coat-models`, newModel, {headers: this.authService.getTokenHeader()}).subscribe({
      next: model => this.attachPhotoToModel(model.id, newModel.image, true),
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  updateModel(id: string, newModel: Model) {
    this.http.put<Model>(`${this.backendUrl}/coat-models/${id}`, newModel, {headers: this.authService.getTokenHeader()}).subscribe({
      next: model => this.attachPhotoToModel(model.id, newModel.image, false),
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }
  private attachPhotoToModel(id: string, newModelPhoto: File, deleteIfError: boolean) {
    let formData: FormData = new FormData();
    formData.append('file', newModelPhoto);
    this.http.patch(`${this.backendUrl}/coat-models/${id}/image`, formData, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Модель додана', isSuccessful: true}})
        this.requestCategories(true);
      },
      error: (err) => {
        console.log(err)
        if(deleteIfError) this.deleteModel(id);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }
  deleteModel(id: string) {
    this.http.delete(`${this.backendUrl}/coat-models/${id}`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.requestCategories(true);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Модель видалено', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }

  private getOrdersOnStatus(orderStatus: string) {
    if(orderStatus === 'PENDING') {
      this.requestAllUnassignedOrders();
    } else {
      this.requestAssignedOrders();
    }
  }

  private fixOrdersDate(orders: Order[]) {
    return orders.map((order) => {
      order.createdAt = (order.createdAt as string).replace('T', ' ');
      return order;
    })
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
