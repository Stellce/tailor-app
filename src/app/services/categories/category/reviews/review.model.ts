import {Reply} from "./reply.model";

export interface Review {
  id: string;
  clientUsername: string;
  clientFullName: string;
  content: string;
  rating: number;
  createdAt: string;
  reply: Reply;
}
