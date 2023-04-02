import { Inject, Injectable, OnDestroy } from "@angular/core";
import { catchError, map, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";


@Injectable()
export class GoogleMapsFacadeService implements OnDestroy{

  private readonly unsubscribe$ = new Subject<void>();
  private selectedLocation: google.maps.GeocoderResult;
  private zoom = 13;
  private display: google.maps.LatLngLiteral;
  private markerOptions: google.maps.MarkerOptions = { draggable: false };
  private markerPositions: google.maps.LatLngLiteral[] = [];

  private center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };

  constructor(private httpClient: HttpClient,
              @Inject(GOOGLE_MAPS_API_KEY) public googleMapsApiKey: string) {
  }

  public getSelectedLocation(): google.maps.GeocoderResult{
    return this.selectedLocation;
  }
  public setSelectedLocation(val:google.maps.GeocoderResult){
    this.selectedLocation = val;
  }

  public setMarkerPosition( val: google.maps.LatLngLiteral){
    this.markerPositions = [];
    this.markerPositions.push(val);
  }
  public getCenter(){
    return this.center;
  }

  public setCenter(val: google.maps.LatLngLiteral ){
    this.center = val;
  }

  public setZoom(val: number){
    this.zoom = val;
  }

  public getZoom(): number{
    return this.zoom;
  }
  public getMarkerPositions(){
    return this.markerPositions;
  }
  public setMarkerPositions(val: google.maps.LatLngLiteral[]){
    this.markerPositions = val;
  }

  public moveMap(event: google.maps.MapMouseEvent): void {
    this.center = (event.latLng.toJSON());
  }

  public move(event: google.maps.MapMouseEvent): void {
    this.display = event.latLng.toJSON();
  }

  public loadGoogleMaps$(): Observable<boolean>{
    return this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}`,
        "callback"
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }


  public extractAddress(geocoderResult: any ){
      const {lat, lng} = geocoderResult.geometry.location;
      const streetNumber = geocoderResult.address_components.find(x => x.types?.find(y => y === 'street_number'));
      const street = geocoderResult.address_components.find(x => x.types?.find(y => y === 'route'));
      const streetAddress = geocoderResult.address_components.find(x => x.types?.find(y => y === 'street_address'));
      const city = geocoderResult.address_components.find(x => x.types?.find(y => y === 'locality'));

      const foundStreet = streetAddress ? streetAddress["long_name"] : street ? street["long_name"] : null;
      let completeAddress = ''
      if (foundStreet) {
        completeAddress = foundStreet;
        if (streetNumber) {
          completeAddress = completeAddress.concat(" ").concat(streetNumber["long_name"])
        }
      }
      return {
        completeAddress,
        city,
        lat,
        lng
      }
  }

  public positionMapToCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  public findAddress$(val: string){
    return this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(val)}&key=${this.googleMapsApiKey}`)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
