import { CustomerSearchResultUi } from "./customer-search-result-ui.interface";

export interface CustomerSearchUi {
  searchTerm: string;
  selectedCustomer: CustomerSearchResultUi;
}
