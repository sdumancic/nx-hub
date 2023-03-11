import { OverviewFilterChipTypeEnum } from "../presentation/filters/filter-chips/overview-filter-chip.model";
import * as moment from "moment";

export interface IMealOrdersOverviewSearchUi {
  status: string,
  datePlacedFrom: moment.Moment,
  datePlacedTo: moment.Moment,
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


interface ChipData{
  removable:boolean
  type: OverviewFilterChipTypeEnum,
  label: string
}
export const FILTER_CHIPS_DATA: Map<string, ChipData> = new Map<string, ChipData>([
  ['status', {removable: false, type: OverviewFilterChipTypeEnum.string, label: 'Status:'}],
  ['category', {removable: true, type: OverviewFilterChipTypeEnum.string, label: 'Category:'}],
  ['datePlacedFrom', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Placed from:'}],
  ['datePlacedTo', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Placed to:'}],
  ['dateDispatchedFrom', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Dispatched from:'}],
  ['dateDispatchedTo', {removable: true,type: OverviewFilterChipTypeEnum.date,label: 'Dispatched to:'}],
  ['dateCompletedFrom', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Completed from:'}],
  ['orderTotalFrom', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Order total from:'}],
  ['orderTotalTo', {removable: true, type: OverviewFilterChipTypeEnum.number,label: 'Order total to:'}],
  ['dateCreatedFrom', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Created from:'}],
  ['dateCreatedTo', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Created to:'}],
  ['deliveryCity', {removable: true, type: OverviewFilterChipTypeEnum.string,label: 'Delivery city:'}],
  ['deliveryAddress', {removable: true, type: OverviewFilterChipTypeEnum.date,label: 'Delivery address:'}]
])
