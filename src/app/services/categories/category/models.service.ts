import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Model} from "./category-model.model";
import {PhotoByOrderId} from "./model-photos/photosByOrderId.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../../auth/error-dialog/error-dialog.component";
import {CategoriesService} from "../categories.service";

@Injectable({providedIn: "root"})
export class ModelsService {
  backendUrl: string = environment.backendUrl;
  private selectedModel: Model;
  private selectedModelListener = new Subject<Model>();
  private addModelInitListener = new Subject<void>();

  private photosByCoatModelId: {coatModelId: string, photosByOrderId: PhotoByOrderId[]}[] = [];
  private modelPhotosListener = new Subject<PhotoByOrderId[]>();

  constructor(
      private http: HttpClient,
      private dialog: MatDialog,
      private authService: AuthService,
      private categoriesService: CategoriesService
      ) {}

  getModelPhotosListener() {
    return this.modelPhotosListener.asObservable();
  }

  getAddModelInitListener() {
    return this.addModelInitListener.asObservable();
  }

  getSelectedModelListener() {
    return this.selectedModelListener.asObservable();
  }
  getSelectedModel() {
    return this.selectedModel;
  }

  emitAddModelInit() {
    this.addModelInitListener.next();
  }
  selectModel(model: Model) {
    this.selectedModel = model;
    this.selectedModelListener.next(model);
  }

  requestModelPhotos(coatModelId: string, isChanged?: boolean) {
    let persists = this.photosByCoatModelId.find(photosByCoatModelId => photosByCoatModelId.coatModelId === coatModelId)
    if(persists && !isChanged) return this.modelPhotosListener.next(persists.photosByOrderId);
    this.http.get<{ [s: string]: string }>(`${this.backendUrl}/coat-models/${coatModelId}/images`).subscribe({
      next: (photos) => {
        let photosByOrderId: PhotoByOrderId[] = [];
        for(let [id, photo] of Object.entries(photos)) {
          photosByOrderId.push({orderId: id, photo: photo})
        }
        this.photosByCoatModelId.push({ coatModelId: coatModelId, photosByOrderId:photosByOrderId});
        this.modelPhotosListener.next(photosByOrderId);
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
        this.categoriesService.requestCategories(true);
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
        this.categoriesService.requestCategories(true);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Модель видалено', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }



}
