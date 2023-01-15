import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MealOrdersDataAccess } from "../data-access/meal-orders-data-access.service";
import { take } from "rxjs";
import { SharedFeatureMealSearchAutocompleteComponent } from "@hub/shared/feature/meal-search-autocomplete";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'hub-feature-meal-orders-overview',
  standalone: true,
  imports: [CommonModule, SharedFeatureMealSearchAutocompleteComponent, ReactiveFormsModule],
  templateUrl: './feature-meal-orders-overview.component.html',
  styleUrls: ['./feature-meal-orders-overview.component.scss'],
})
export class FeatureMealOrdersOverviewComponent implements OnInit{

  form: FormGroup
  constructor(private readonly dataAccess: MealOrdersDataAccess, private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      meal: new FormControl(null)
    })
  }




  ngOnInit(): void {

  }

  setValue() {
    this.form.setValue({meal: {id:2}})

  }
}
