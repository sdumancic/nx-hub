import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import * as qs from 'qs';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OverviewUrlParamsService {
  private readonly urlChanged = new Subject<Params>();

  private currentQueryParams: Params = {};

  get urlChanged$(): Observable<Params> {
    return this.urlChanged.asObservable();
  }

  constructor(public location: Location, private readonly router: Router) {
    this.location.onUrlChange((url) => {
      const queryParams = url.split('?')[1];
      const params = qs.parse(queryParams) as Params;
      if (params !== this.currentQueryParams) {
        this.currentQueryParams = params;
        this.urlChanged.next(params);
      }
    });
  }

  mergeSetUrl(newParams: Params, oldParams: Params): void {
    const urlTree = this.router.createUrlTree([], {
      queryParams: Object.assign({}, newParams, oldParams),
      preserveFragment: true,
    });
    this.location.go(urlTree.toString());
  }

  setUrlMergeQueryParams(activeTabIndex: number, params: Params): void {
    let copy = params;
    if (activeTabIndex !== undefined) {
      copy = { ...{ activeTab: activeTabIndex }, ...params };
    }
    console.log('copy', copy);
    const urlTree = this.router.createUrlTree([], {
      queryParams: copy,
      queryParamsHandling: 'merge',
    });
    console.log(urlTree.toString());
    this.location.go(urlTree.toString());
  }
}
