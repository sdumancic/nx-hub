export interface IOrdersOverviewSearchResultUi {
  id: number;
  datePlaced: string;
  dateDispatched: string;
  dateCompleted: string;
  status: string;
  paymentMethod: string;
  orderTotalNoVat: number;
  orderTotalWithVat: number;
  deliveryLocationLon: number;
  deliveryLocationLat: number;
  deliveryAddress: string;
  deliveryCity: string;
  notes: string;
}
