export interface LovItem {
  code: string
  value: string
}
export interface SearchMeta {
  pagination?: { index: number, size: number }
  sorting?: { attribute: string, order?: string }
}
export interface ResourceCollectionMetadata{
  page: number
  size: number,
  totalResources: number
}

export interface ResourceCollection {
  data: any[]
  metadata: ResourceCollectionMetadata
}

