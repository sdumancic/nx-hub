import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Address } from "./address.model";

@Injectable({
  providedIn: "root"
})
export class AddressDataAccess {

  url = "http://localhost:3000/addresses";

  constructor(
    private readonly http: HttpClient
  ) {  }

  public getAddresses$(
    queryFilter: string
  ): Observable<Address[]> {
    return this.http.get<Address[]>(
      `${this.url}`
    );
  }

  public getAddress$(
    id: number
  ): Observable<Address> {
    return this.http.get<Address>(
      `${this.url}/${id}`
    );
  }

  updateAddress$(id: number, updatedAddress: Address): Observable<Address> {
    return this.http.patch<Address>(`${this.url}/${id}`,updatedAddress);
  }

  createAddress$(newAddress: Address): Observable<Address> {
    return this.http.post<Address>(`${this.url}`,newAddress);
  }

  deleteAddress$(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
