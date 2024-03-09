import {Model} from "./category-model.model";
import {ShortOrder} from "../../../account/orders/order/short-order.model";

export interface Category {
  coatType: string;
  text: string;
  models: Model[];
  orders: ShortOrder[];
}
