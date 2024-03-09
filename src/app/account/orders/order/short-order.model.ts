import {ShortModel} from "../../../services/categories/category/short-category-model.model";

export interface ShortOrder {
  num?: number;
  id: string;
  price: string;
  createdAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  coatModel: ShortModel;
}
