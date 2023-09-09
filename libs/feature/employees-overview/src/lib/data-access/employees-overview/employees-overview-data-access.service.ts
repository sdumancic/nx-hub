import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  delay,
  forkJoin,
  map,
  merge,
  mergeMap,
  Observable,
  shareReplay,
  Subject,
  take,
} from 'rxjs';
import { WORKPLACE_RESERVATION_API_BACKEND_URL } from '@hub/shared/util/app-config';
import {
  EmployeeOverview,
  EmployeeOverviewMetadata,
} from './employee-overview.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeesOverviewDataAccess {
  private update$ = new Subject();
  private initialMetadata$: Observable<EmployeeOverviewMetadata>;
  private metadata$: Observable<EmployeeOverviewMetadata>;

  private updates$: Observable<{
    roles: string[];
    departments: string[];
    genders: string[];
    states: string[];
  }>;

  constructor(
    @Inject(WORKPLACE_RESERVATION_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {
    this.initialMetadata$ = this.fetchMetadataOnce$();
    this.updates$ = this.update$.pipe(
      mergeMap(() => this.fetchMetadataOnce$())
    );
  }

  public refreshMetadata$() {
    this.metadata$ = merge(this.initialMetadata$, this.updates$).pipe(
      shareReplay(0)
    );
    return this.metadata$;
  }

  public fetchEmployees$(
    queryString: string
  ): Observable<{ data: EmployeeOverview[]; totalCount: string }> {
    return this.http
      .get<EmployeeOverview[]>(`${this.url}/employees${queryString}`, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return {
            data: res.body,
            totalCount: res.headers.get('x-total-count'),
          };
        })
      );
  }

  fetchRoles$(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/roles`);
  }

  fetchDepartments$(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/departments`);
  }

  fetchGenders$(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/genders`);
  }

  fetchStates$(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/states`);
  }

  get roles(): Observable<string[]> {
    return this.metadata$?.pipe(map((metadata) => metadata?.roles));
  }

  private fetchMetadataOnce$() {
    return forkJoin([
      this.fetchRoles$(),
      this.fetchDepartments$(),
      this.fetchGenders$(),
      this.fetchStates$(),
    ]).pipe(
      map((el) => {
        return {
          roles: el[0],
          departments: el[1],
          genders: el[2],
          states: el[3],
        };
      }),
      delay(2000),
      take(1)
    );
  }
}
