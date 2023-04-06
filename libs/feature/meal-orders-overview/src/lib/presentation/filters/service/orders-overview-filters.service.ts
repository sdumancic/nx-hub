import { Inject, Injectable, LOCALE_ID, OnDestroy } from "@angular/core";
import { Category, Topping } from "@hub/shared/model/food-models";
import { combineLatest, distinctUntilChanged, mapTo, merge, Observable, Subject, takeUntil, tap, zip } from "rxjs";
import {
  CATEGORY_CONTROL_KEY,
  IMealOrdersOverviewSearchUi,
  TOPPING_CONTROL_KEY
} from "../../../forms/meal-orders-overview-search.ui.model";
import { map } from "rxjs/operators";
import { IOverviewFilterChip, OverviewFilterChipTypeEnum } from "../filter-chips/overview-filter-chip.model";
import { MealOrdersOverviewFacadeService } from "../../../facade/meal-orders-overview-facade.service";
import { OrdersOverviewFormService } from "../../../forms/orders-overview-form.service";
import { MealOrdersOverviewMapper } from "../../../facade/meal-orders-overview.mapper";
import * as moment from "moment";

@Injectable()
export class OrdersOverviewFiltersService implements OnDestroy {
  private categoryLov: Category[];
  private toppingLov: Topping[];

  private readonly containerClick$ = new Subject<void>();
  private readonly filterChipsRefresh$ =
    new Subject<IMealOrdersOverviewSearchUi>();
  private readonly unsubscribe$ = new Subject<void>();
  private readonly momentDateFormat: string = 'DD/MM/yyyy';

  get activeFiltersCount$(): Observable<number> {
    return this.facade.searchValues$.pipe(
      distinctUntilChanged(),
      map(this.countActiveFilters)
    );
  }

  get quickFiltersValueChange$(): Observable<void> {
    return merge(
      this.formService.searchControl.valueChanges
    ).pipe(mapTo(undefined));
  }

  get appliedFilterChips$(): Observable<IOverviewFilterChip[]> {
    return merge(this.facade.searchValues$, this.filterChipsRefresh$).pipe(
      map(this.getFilterChips),
    );
  }

  get containerClicks$(): Observable<void> {
    return this.containerClick$.asObservable();
  }

  constructor(
    private readonly facade: MealOrdersOverviewFacadeService,
    private readonly formService: OrdersOverviewFormService,
    @Inject(LOCALE_ID) private locale: string

  ) {
    this.subscribeToMetadataChanges();
  }

  ngOnDestroy(): void {
    this.filterChipsRefresh$.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nextContainerClick(): void {
    this.containerClick$.next();
  }

  searchOnFilterChipRemoval(): void {
    this.facade.search(this.formService.formGroupRawValue);
  }

  private subscribeToMetadataChanges(): void {
    combineLatest(this.facade.categories$, this.facade.toppings$)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: [Category[], Topping[]]) => {
        const [categories, toppings] = data;
        this.categoryLov = categories;
        this.toppingLov = toppings;
        this.filterChipsRefresh$.next(this.facade.searchValues);
      });
  }

  private readonly isActiveFilter = (value: any): boolean => {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return value !== null && value !== '' && value !== false;
  };

  private readonly countActiveFilters = (
    searchValues: IMealOrdersOverviewSearchUi
  ): number => {
    return Object.values(searchValues).filter(this.isActiveFilter).length;
  };

  private readonly getFilterChips = (
    searchValues: IMealOrdersOverviewSearchUi
  ): IOverviewFilterChip[] => {
    return Object.keys(searchValues)
      .map((key) => this.getChip(key, searchValues[key]), [])
      .filter((value) => value !== null);
  };

  private readonly getChip = (
    key: string,
    value: string
  ): IOverviewFilterChip | null => {
    if (!this.isActiveFilter(value)) {
      return null;
    }
    const valueType: OverviewFilterChipTypeEnum =
      MealOrdersOverviewMapper.getFilterType(key);
    return {
      controlKey: key,
      label: this.getChipLabel(key),
      value: this.getFilterValue(key, value, valueType),
      type: valueType,
      removable: this.isChipRemovable(key),
    };
  };

  private isChipRemovable(key) {
    return MealOrdersOverviewMapper.getFilterRemovable(key);
  }

  private getChipLabel(key) {
    return MealOrdersOverviewMapper.getFilterLabel(key);
  }

  private readonly getFilterValue = (
    key: string,
    value: any,
    type: OverviewFilterChipTypeEnum
  ): string => {
    if (Array.isArray(value)) {
      return value
        .map((id: number) => this.getMetadataCodeDescriptionValue(key, id))
        .join(', ');
    }

    if (type === OverviewFilterChipTypeEnum.number) {
      return value.toString(10);
    }

    if (type === OverviewFilterChipTypeEnum.boolean) {
      return '';
    }
    if (
      type === OverviewFilterChipTypeEnum.date &&
      !isNaN(Date.parse(value)) &&
      !isNaN(moment(value).toDate().getDate())
    ) {
      return moment(value).locale(this.locale).format('L')
    }

    if (typeof value === 'string') {
      return value;
    }
  };

  // keys are search ui attributes/form controls
  private readonly getMetadataCodeDescriptionValue = (
    key: string,
    id: number
  ): string => {
    if (key === CATEGORY_CONTROL_KEY) {
      return this.categoryLov.find((category) => category.id === id)?.name;
    } else if (key === TOPPING_CONTROL_KEY) {
      return this.toppingLov.find((topping) => topping.id === id)?.name;
    }
  };
}
