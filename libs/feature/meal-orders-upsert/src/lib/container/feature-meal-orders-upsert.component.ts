import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { materialModules } from "@hub/shared/ui/material";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { StepperSideboardComponent } from "@hub/shared/ui/stepper";
import { SharedUiSectionComponent, SharedUiSectionGroupComponent } from "@hub/shared/ui/section";
import { SharedUiSideboardComponent } from "@hub/shared/ui/sideboard";
import { MealOrdersUpsertFacadeService } from "../facade/meal-orders-upsert-facade.service";
import { MealsTableComponent } from "../presentation/meals-table/meals-table.component";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { Observable } from "rxjs";
import { CartItem } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";

@Component({
  selector: 'hub-feature-meal-orders-upsert',
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent, SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent, MealOrderCartSmallComponent],
  templateUrl: './feature-meal-orders-upsert.component.html',
  styleUrls: ['./feature-meal-orders-upsert.component.scss'],
  providers: [
    MealOrdersUpsertFacadeService,
    CartInMemoryService
  ]
})
export class FeatureMealOrdersUpsertComponent implements OnInit{

  categories$ = this.facade.categories$
  cartItems$:  Observable<CartItem[] >= this.facade.cartItems$
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 3;

  constructor(
    private route: ActivatedRoute,
    private facade: MealOrdersUpsertFacadeService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params){
        this.orderId = +params;
      }
    });
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
     this.searchMeals();
    }
  }

  protected searchMeals(): void{
    this.facade.executeSearch(this.selectedCategoryId,this.searchValue);
  }

  onAddToCart(meal: IMealsSearchResultUi) {
    this.facade.addToCart(meal);
  }

  onItemsChanged(items: CartItem[]) {
    this.facade.setCartItems(items);
  }

  emptyCart() {
    this.facade.setCartItems([]);
  }
}
