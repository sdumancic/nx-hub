import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";
import { Observable } from "rxjs";
import { Categories, PagedMeals } from "@hub/shared/model/food-models";

@Injectable({
  providedIn: 'root'
})
export class MealSearchDataAccessService {

  constructor(
    @Inject(FOOD_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {}

  fetchCategories(): Observable<Categories> {
    return this.http.get<Categories>(`${this.url}/categories`)
  }

  fetchMealsForCategory(categoryId: number, name: string): Observable<PagedMeals>{
    return this.http.get<PagedMeals>(`${this.url}/meals/search?categoryId=${categoryId}&name=${name}&limit=100`)
  }
}
