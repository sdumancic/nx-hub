import { Injectable } from '@angular/core';
import { MealOrdersDataAccess } from '../data-access/meal-orders-data-access.service';

@Injectable()
export class MealOrdersOverviewFacadeService {
  constructor(private dataAccess: MealOrdersDataAccess) {}
}
