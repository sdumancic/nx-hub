import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { WORKPLACE_RESERVATION_API_BACKEND_URL } from '@hub/shared/util/app-config';
import { EmployeeOverview, EmployeeOverviewMetadata, EmployeeResourceCollection } from "./employee-overview.model";

@Injectable({
  providedIn: 'root',
})
export class EmployeesOverviewDataAccess {
  private readonly metadataRefresh$ = new BehaviorSubject<void>(null);
  private readonly metadata$: Observable<EmployeeOverviewMetadata> =
    this.metadataRefresh$.pipe(
      switchMap(() => forkJoin([this.fetchRoles$(), this.fetchDepartments$(),this.fetchGenders$(),this.fetchStates$()])),
      map((el) => {
        return {
          roles: el[0],
          departments: el[1],
          genders: el[2],
          states: el[3]
        };
      }),
      shareReplay(1)
    );

  constructor(
    @Inject(WORKPLACE_RESERVATION_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {
    console.log('xxx ' +url + " yyy")
  }

  public fetchEmployees$(
    queryString: string
  ): Observable<{data:EmployeeOverview[], totalCount:string}> {
    return this.http.get<EmployeeOverview[]>(
      `${this.url}/employees${queryString}`,
      {observe: 'response'}
    ).pipe(map(res => {
      return {
        data: res.body,
        totalCount: res.headers.get('x-total-count')
      }
    }));
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

  refreshMetadata$(): void {
    this.metadataRefresh$.next();
  }

  get roles(): Observable<string[]> {
    return this.metadata$.pipe(map((metadata) => metadata.roles));
  }

  get departments(): Observable<string[]> {
    return this.metadata$.pipe(map((metadata) => metadata.departments));
  }

  get genders(): Observable<string[]> {
    return this.metadata$.pipe(map((metadata) => metadata.genders));
  }

  get states(): Observable<string[]> {
    return this.metadata$.pipe(map((metadata) => metadata.states));
  }

}
