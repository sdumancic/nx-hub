export interface IDataColumnConfig {
  displayed: boolean
  name: string
  width: number
}

export enum IDatatableSortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  INITIAL = 'initial'
}

export interface IDatatableSortEvent {
  column: string
  direction: IDatatableSortDirection
}

export const ORDERS_OVERVIEW_DISPLAYED_COLUMNS: IDataColumnConfig[] = [
  {
    displayed: true,
    name: 'id',
    width: 50
  },
  {
    displayed: false,
    name: 'datePlaced',
    width: 100
  },
  {
    displayed: false,
    name: 'dateDispatched',
    width: 100
  },
  {
    displayed: false,
    name: 'paymentMethod',
    width: 100
  },
  {
    displayed: false,
    name: 'orderTotalNoVat',
    width: 100
  },
  {
    displayed: false,
    name: 'orderTotalWithVat',
    width: 150
  },
  {
    displayed: false,
    name: 'deliveryAddress',
    width: 150
  }
]
