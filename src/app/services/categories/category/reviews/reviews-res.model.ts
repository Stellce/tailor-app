import {Review} from "./review.model";

export interface ReviewsRes {
  content: Review[];
  last: boolean;
  first: boolean;
}
