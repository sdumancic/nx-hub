
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

export function isBlank(val: string){
  if (val == null || val.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function isNotBlank(val: string){
  return !isBlank(val);
}

export function isStringEmpty(value: string) {
  return !value?.trim().length
}
