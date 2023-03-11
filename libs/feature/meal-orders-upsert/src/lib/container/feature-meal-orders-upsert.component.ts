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

@Component({
  selector: 'hub-feature-meal-orders-upsert',
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent, SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent],
  templateUrl: './feature-meal-orders-upsert.component.html',
  styleUrls: ['./feature-meal-orders-upsert.component.scss'],
  providers: [
    MealOrdersUpsertFacadeService
  ]
})
export class FeatureMealOrdersUpsertComponent implements OnInit{

  categories$ = this.facade.categories$
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 1;

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
}
