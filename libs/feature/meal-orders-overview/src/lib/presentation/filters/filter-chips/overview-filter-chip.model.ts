export class IOverviewFilterChip {
  controlKey: string
  term?: string
  value: string
  type: OverviewFilterChipTypeEnum
  removable: boolean
}

export enum OverviewFilterChipTypeEnum {
  'string',
  'number',
  'date',
  'boolean'
}
