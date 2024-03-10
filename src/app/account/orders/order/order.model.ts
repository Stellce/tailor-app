import {Model} from "../../../services/categories/category/category-model.model";
import {ProductMetrics} from "../../../services/calculator/product-metrics.model";
import {ShortOrder} from "./short-order.model";

export interface Order extends ShortOrder{
  coatModel: Model;
  image?: string;
  patternData?: {[s: string]: string};
  productMetrics?: ProductMetrics;
}
