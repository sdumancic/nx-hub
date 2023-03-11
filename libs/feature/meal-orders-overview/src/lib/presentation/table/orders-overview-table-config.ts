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
    displayed: true,
    name: 'datePlaced',
    width: 100
  },
  {
    displayed: true,
    name: 'dateDispatched',
    width: 100
  },
  {
    displayed: true,
    name: 'paymentMethod',
    width: 100
  },
  {
    displayed: true,
    name: 'orderTotalNoVat',
    width: 100
  },
  {
    displayed: true,
    name: 'orderTotalWithVat',
    width: 150
  },
  {
    displayed: true,
    name: 'deliveryAddress',
    width: 150
  },
  {
    displayed: true,
    name: 'deliveryCity',
    width: 150
  },
  {
    displayed: true,
    name: 'map',
    width: 50
  },
  {
    displayed: true,
    name: 'actions',
    width: 50
  }
]
