import { Observable } from "rxjs";
import { LovItem } from "../data-access/standard.model";
import { map } from "rxjs/operators";

export function mapStringToLov$(
  values: Observable<string[]>
): Observable<LovItem[]> {
  return values.pipe(
    map((value: string[]) =>
      value?.map(
        item => <LovItem>{ code: item, value: item }
      )
    )
  )
}

export function mapStringToLov(
  values: string[]
) {
   return  values.map((value: string) =>
      <LovItem>{ code: value, value: value }
    )
}
