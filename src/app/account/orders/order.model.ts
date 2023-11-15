import {Model} from "../../categories/category/category-model.model";

export interface Order {
  num?: number;
  id: string;
  createdAt: string | Date;
  coatModel: Model;
  patternData: {[s: string]: string};
}
