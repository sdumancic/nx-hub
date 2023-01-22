import { OverviewFilterChipTypeEnum } from "../presentation/filters/filter-chips/overview-filter-chip.model";

export interface IMealOrdersOverviewSearchUi {
  status: string[],
  datePlacedFrom: string,
  datePlacedTo: string,
  dateDispatchedFrom: string,
  dateDispatchedTo: string,
  dateCompletedFrom: string,
  dateCompletedTo: string,
  orderTotalFrom: number,
  orderTotalTo: number,
  dateCreatedFrom: string,
  dateCreatedTo: string,
  deliveryCity: string,
  deliveryAddress: string
}

export const STATUS_CONTROL_KEY = 'status'
export const CATEGORY_CONTROL_KEY = 'category'
export const TOPPING_CONTROL_KEY = 'topping'


export const FILTER_KEY_VALUE_TYPE: Map<string, OverviewFilterChipTypeEnum> =
  new Map<string, OverviewFilterChipTypeEnum>([
    ['status', OverviewFilterChipTypeEnum.string],
    ['datePlacedFrom', OverviewFilterChipTypeEnum.date],
    ['datePlacedTo', OverviewFilterChipTypeEnum.date],
    ['dateDispatchedFrom', OverviewFilterChipTypeEnum.date],
    ['dateDispatchedTo', OverviewFilterChipTypeEnum.date],
    ['dateCompletedFrom', OverviewFilterChipTypeEnum.date],
    ['orderTotalFrom', OverviewFilterChipTypeEnum.number],
    ['orderTotalTo', OverviewFilterChipTypeEnum.number],
    ['dateCreatedFrom', OverviewFilterChipTypeEnum.date],
    ['dateCreatedTo', OverviewFilterChipTypeEnum.date],
    ['deliveryCity', OverviewFilterChipTypeEnum.string],
    ['deliveryAddress', OverviewFilterChipTypeEnum.string]
  ])

export const FILTER_KEY_REMOVABLE: Map<string, boolean> = new Map<
string,
boolean
>([
  ['status', false],
  ['datePlacedFrom', true],
  ['datePlacedTo', true],
  ['dateDispatchedFrom', true],
  ['dateDispatchedTo', true],
  ['dateCompletedFrom', true],
  ['orderTotalFrom', true],
  ['orderTotalTo', true],
  ['dateCreatedFrom', true],
  ['dateCreatedTo', true],
  ['deliveryCity', true],
  ['deliveryAddress', true]
])
