import {Model} from "./category-model.model";
import {Order} from "../../account/orders/order/order.model";

export interface Category {
  coatType: string;
  text: string;
  models: Model[];
  orders: Order[];
}
