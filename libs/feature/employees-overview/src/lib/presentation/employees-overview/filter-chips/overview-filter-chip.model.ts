export class OverviewFilterChip {
  controlKey: string
  label: string
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
