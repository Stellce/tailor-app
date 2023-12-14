import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OrdersService} from "../../../account/orders/orders.service";
import {mimeType} from "./mime-type.validator";
import {Model} from "../../../services/categories/category/category-model.model";
import {ModelsService} from "../models.service";
import {CategoriesService} from "../../../services/categories/categories.service";

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.scss'
})
export class AddModelComponent implements OnInit{
  modelForm: FormGroup;
  coatTypes: { coatType: string, text: string }[];
  imagePreview: string;
  model: Model;
  constructor(
    private ordersService: OrdersService,
    private modelsService: ModelsService,
    private categoriesService: CategoriesService,
    ) {}

  ngOnInit() {
    this.coatTypes = this.categoriesService.getCategories().map(category => {
      return {coatType: category.coatType, text: category.text}
    });
    this.modelForm = new FormGroup({
      id: new FormControl(''),
      coatType: new FormControl('', Validators.required),
      image: new FormControl('', {validators: Validators.required, asyncValidators: mimeType}),
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      videoUrl: new FormControl('', [Validators.required, Validators.pattern(/youtu/)])
    })
    this.model = this.modelsService.getSelectedModel();
    this.modelsService.getSelectedModelListener().subscribe(model => {
      this.model = model
      if(Object.keys(this.model).length <= 0) return this.modelForm.reset();
      Object.entries(this.model).forEach(([k, v]) => {
        if(!Object.keys(this.modelForm.controls).includes(k)) return;
        if(k == 'image') {
          this.imagePreview = 'data:image/png;base64, ' + v;
          this.modelForm.patchValue({image: this.ordersService.base64ToFile(v)})
          return
        }
        let obj: any = {};
        obj[k] = v;
        this.modelForm.patchValue(obj);
      });
    });
    this.modelsService.emitAddModelInit();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.modelForm.patchValue({image: file});
    this.modelForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSubmit() {
    if(this.modelForm.invalid) return;
    const newModel: Model = {
      id: this.modelForm.controls['id'].value,
      coatType: this.modelForm.controls['coatType'].value,
      name: this.modelForm.controls['name'].value,
      price: this.modelForm.controls['price'].value,
      image: this.modelForm.controls['image'].value,
      videoUrl: this.modelForm.controls['videoUrl'].value
    };
    console.log(newModel)
    if(this.model.name) return this.modelsService.updateModel(newModel.id, newModel);
    this.modelsService.createModel(newModel);
    this.modelForm.reset();
  }
  onDeleteModel() {
    this.modelsService.deleteModel(this.model.id);
    this.modelForm.reset();
    this.modelsService.selectModel({} as Model);
  }
}
