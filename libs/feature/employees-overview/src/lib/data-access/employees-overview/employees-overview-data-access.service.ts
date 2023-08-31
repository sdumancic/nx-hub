import { Inject, Injectable, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject, delay,
  forkJoin,
  map, merge, mergeMap,
  Observable, of,
  shareReplay, Subject,
  switchMap, take
} from "rxjs";
import { WORKPLACE_RESERVATION_API_BACKEND_URL } from '@hub/shared/util/app-config';
import { EmployeeOverview, EmployeeOverviewMetadata, EmployeeResourceCollection } from "./employee-overview.model";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class EmployeesOverviewDataAccess{
  private update$ = new Subject()
  private initialMetadata$: Observable<EmployeeOverviewMetadata>
  private metadata$: Observable<EmployeeOverviewMetadata>
  private updates$: Observable<{roles: string[], departments: string[], genders: string[], states: string[]}>


  constructor(
    @Inject(WORKPLACE_RESERVATION_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {
    this.initialMetadata$ = this.fetchMetadataOnce$()
    this.updates$ = this.update$.pipe(
      mergeMap(() => this.fetchMetadataOnce$())
    )
    //this.metadata$ = merge(this.initialMetadata$, this.updates$).pipe(shareReplay(1))
  }

  public refreshMetadata$() {
    this.metadata$ = merge(this.initialMetadata$, this.updates$).pipe(shareReplay(1))
    return this.metadata$
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

  get roles(): Observable<string[]> {
    return this.metadata$ ? this.metadata$.pipe(map((metadata) => metadata.roles)) : of([]);
  }

  get departments(): Observable<string[]> {
    return this.metadata$ ? this.metadata$.pipe(map((metadata) => metadata.departments)) : of([]);
  }

  get genders(): Observable<string[]> {
    return this.metadata$ ? this.metadata$.pipe(map((metadata) => metadata.genders)): of([]) ;
  }

  get states(): Observable<string[]> {
    return this.metadata$ ? this.metadata$.pipe(map((metadata) => metadata.states)) : of([]);
  }

  private fetchMetadataOnce$(){
    return forkJoin([this.fetchRoles$(), this.fetchDepartments$(),this.fetchGenders$(),this.fetchStates$()])
      .pipe(
        map((el) => {
          return {
            roles: el[0],
            departments: el[1],
            genders: el[2],
            states: el[3]
          };
        }),
        tap(() => console.log('fetching data from db', new Date())),
        delay(2000),
        tap(() => console.log('fetched', new Date())),
        take(1))
  }
}
