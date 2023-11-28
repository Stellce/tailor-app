import {Model} from "../../../categories/category/category-model.model";
import {ProductMetrics} from "../../../categories/category/calculator/product-metrics.model";

export interface Order {
  num?: number;
  id: string;
  createdAt: string | Date;
  status: string;
  coatModel: Model;
  patternData: {[s: string]: string};
  productMetrics: ProductMetrics;
}
