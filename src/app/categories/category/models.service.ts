import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Model} from "../../services/categories/category/category-model.model";
import {PhotoByOrderId} from "../../services/categories/category/model-photos/photosById.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";

@Injectable({providedIn: "root"})
export class ModelsService {
  backendUrl: string = environment.backendUrl;
  private selectedModel: Model;
  private selectedModelListener = new Subject<Model>();
  private addModelInitListener = new Subject<void>();

  private photosByCoatModelId: {coatModelId: string, photosByOrderId: PhotoByOrderId[]}[] = [];
  private modelPhotosListener = new Subject<PhotoByOrderId[]>();

  constructor(
      private http: HttpClient
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




}
