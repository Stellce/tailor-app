import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {Category} from "./category.model";
import {Model} from "./category-model.model";
import {VideoDialogComponent} from "./video-dialog/video-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {CalculatorService} from "../../calculator/calculator.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../account/user.model";
import {ModelsService} from "./models.service";
import {CategoriesService} from "../categories.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit, OnDestroy{
  @Input()category: Category;
  @Input()hidden: boolean;
  selectedModel: Model;
  categorySub: Subscription;
  categories: Category[];
  arePhotosShowen: boolean = false;
  params: Params;
  isAddingModel: boolean = false;
  user: User;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private calcService: CalculatorService,
    private modelsService: ModelsService,
    private categoriesService: CategoriesService
  ) {}
  ngOnInit() {
    this.categorySub = this.categoriesService.getCategoriesListener().subscribe(categories => {
      this.categories = categories;
      this.findCategory();
    })
    this.activatedRoute.params.subscribe(params => {
      if(params) this.hidden = false
      this.category = this.categoriesService.getSelectedCategory();
      this.params = params;
      if(!this.categories) return;
      this.findCategory();
    })
    this.user = this.authService.getUser();
  }
  onSwitchAddingModel() {
    this.isAddingModel = !this.isAddingModel;
    this.selectedModel = {} as Model;
    this.modelsService.selectModel({} as Model);
  }

  onModelSelect(model: Model) {
    if(this.selectedModel?.id === model.id) return;
    this.isAddingModel = false;
    this.selectedModel = model;
    this.modelsService.getAddModelInitListener().subscribe(() => {
      this.modelsService.selectModel(model);
    });
    this.modelsService.selectModel(model);
    this.calcService.isEditableEmitter(true);
    this.modelsService.requestModelPhotos(this.selectedModel.id);
  }

  openVideo(videoUrl: string) {
    this.dialog.open(VideoDialogComponent, {data: {videoUrl: videoUrl}});
  }
  onShowPhotos(modelId: string) {
    if(this.selectedModel.id !== modelId) return;
    this.arePhotosShowen = !this.arePhotosShowen;
    if(this.arePhotosShowen) this.modelsService.requestModelPhotos(modelId);
  }

  isAdmin() {
    return this.authService.getUser().roles?.includes('ADMIN');
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }

  private findCategory() {
    this.category = this.categories.find(category => category.coatType?.toUpperCase() === this.params['category']?.toUpperCase())!
  }

}
