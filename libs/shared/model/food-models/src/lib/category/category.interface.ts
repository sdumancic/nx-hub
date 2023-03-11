export interface Category {
  id: number;
  name?: string;
  iconUrl?: string;
  active?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface Categories{
  categories: Category[]
}
