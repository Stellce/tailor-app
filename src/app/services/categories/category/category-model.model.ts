export interface Model {
  id?: string;
  coatType: string;
  image: File;
  name: string;
  price: number;
  videoUrl: string | null;
}
