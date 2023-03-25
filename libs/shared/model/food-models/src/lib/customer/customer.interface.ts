export interface CustomerLocation{
    type: string,
    coordinates: [number, number]

}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  customerLocation: CustomerLocation;
  createdAt: Date;
  modifiedAt: Date;

}
