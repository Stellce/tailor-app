import {Model} from "./category-model.model";
import {Order} from "../../account/orders/order.model";

export interface Category {
  coatType: string;
  text: string;
  models: Model[];
  orders: Order[];
}
