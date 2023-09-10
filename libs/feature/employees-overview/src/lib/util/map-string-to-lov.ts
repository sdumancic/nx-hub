import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LovItem } from '@hub/shared/workplace-reservation-data-access';

export function mapStringToLov$(
  values: Observable<string[]>
): Observable<LovItem[]> {
  return values.pipe(
    map((value: string[]) =>
      value?.map((item) => <LovItem>{ code: item, value: item })
    )
  );
}

export function mapStringToLov(values: string[]) {
  return values.map((value: string) => <LovItem>{ code: value, value: value });
}
