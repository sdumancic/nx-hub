import {
  DATE_COMPLETED,
  DATE_DISPATCHED,
  DATE_PLACED,
  DELIVERY_ADDRESS,
  DELIVERY_CITY,
  ORDER_ID,
  ORDER_TOTAL_NO_VAT,
  ORDER_TOTAL_WITH_VAT,
  PagedOrders,
  PAYMENT_METHOD,
  STATUS
} from "@hub/shared/model/food-models";
import { IOrdersOverviewSearchResultUi } from "../presentation/table/orders-overview-search-result.ui.model";
import { OverviewFilterChipTypeEnum } from "../presentation/filters/filter-chips/overview-filter-chip.model";
import { FILTER_CHIPS_DATA} from "../forms/meal-orders-overview-search.ui.model";
import { IDatatableSortDirection } from "../presentation/table/orders-overview-table-config";

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class MealOrdersOverviewMapper {
  static fromResourceCollectionToSearchResultUi(
    resource: PagedOrders
  ): IOrdersOverviewSearchResultUi[] {
    return resource.list?.map(
      (element) =>
        ({
          id: element.id,
          datePlaced: element.datePlaced ? new Date(element.datePlaced).toLocaleString('hr-HR') : null,
          dateDispatched:  element.dateDispatched ? new Date(element.dateDispatched).toLocaleString('hr-HR') : null,
          dateCompleted: element.dateCompleted ? new Date(element.dateCompleted).toLocaleString('hr-HR'): null,
          status: element.status,
          paymentMethod: element.paymentMethod,
          orderTotalNoVat: element.orderTotalNoVat,
          orderTotalWithVat: element.orderTotalWithVat,
          deliveryLocationLon: element.deliveryLocation?.coordinates? element.deliveryLocation?.coordinates[0] : null,
          deliveryLocationLat: element.deliveryLocation?.coordinates ? element.deliveryLocation.coordinates[1] : null,
          deliveryAddress: element.deliveryAddress,
          deliveryCity: element.deliveryCity,
          notes: element.notes
        } as IOrdersOverviewSearchResultUi)
    );
  }

  static getSortingAttributeKey(key: string): string {
    const sortingAttributesMap: Map<string, string> = new Map([
      ['id', ORDER_ID],
      ['datePlaced', DATE_PLACED],
      ['dateDispatched', DATE_DISPATCHED],
      ['dateCompleted', DATE_COMPLETED],
      ['status', STATUS],
      ['paymentMethod', PAYMENT_METHOD],
      ['orderTotalNoVat', ORDER_TOTAL_NO_VAT],
      ['orderTotalWithVat', ORDER_TOTAL_WITH_VAT],
      ['deliveryAddress', DELIVERY_ADDRESS],
      ['deliveryCity', DELIVERY_CITY],
    ]);
    return sortingAttributesMap.get(key);
  }

  static getFilterType(filterKey: string): OverviewFilterChipTypeEnum {
    return FILTER_CHIPS_DATA.get(filterKey).type;
  }

  static getFilterRemovable(filterKey: string): boolean {
    return FILTER_CHIPS_DATA.get(filterKey).removable;
  }
  static getFilterLabel(filterKey: string): string {
    return FILTER_CHIPS_DATA.get(filterKey).label;
  }

  static getSortingDirection (
    direction: IDatatableSortDirection
  ): SortDirection {
    const sortingDirectionAttributesMap: Map<string, string> = new Map([
      [IDatatableSortDirection.ASCENDING, SortDirection.ASC],
      [IDatatableSortDirection.DESCENDING, SortDirection.DESC],
      [IDatatableSortDirection.INITIAL, '']
    ])
    return sortingDirectionAttributesMap.get(direction) as SortDirection
  }
}
