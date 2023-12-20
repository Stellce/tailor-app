import {Model} from "../../../services/categories/category/category-model.model";
import {ProductMetrics} from "../../../services/calculator/product-metrics.model";

export interface Order {
  num?: number;
  id: string;
  createdAt: string;
  status: string;
  coatModel: Model;
  patternData: {[s: string]: string};
  productMetrics: ProductMetrics;
}
