import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MealOrdersDataAccess } from "../data-access/meal-orders-data-access.service";
import { take } from "rxjs";
import { SharedFeatureMealSearchAutocompleteComponent } from "@hub/shared/feature/meal-search-autocomplete";

@Component({
  selector: 'hub-feature-meal-orders-overview',
  standalone: true,
  imports: [CommonModule, SharedFeatureMealSearchAutocompleteComponent],
  templateUrl: './feature-meal-orders-overview.component.html',
  styleUrls: ['./feature-meal-orders-overview.component.scss'],
})
export class FeatureMealOrdersOverviewComponent implements OnInit{
  constructor(private readonly dataAccess: MealOrdersDataAccess) {  }

  ngOnInit(): void {
  }
}
