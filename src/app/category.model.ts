import {Model} from "./categories/category/category-model.model";

export interface Category {
  coatType: string;
  text: string;
  models: Model[];
}
