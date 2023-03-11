import { Component, Inject, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapDirectionsService, MapInfoWindow, MapMarker } from "@angular/google-maps";
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { GOOGLE_MAPS_API_KEY } from '@hub/shared/util/app-config';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

export interface GoogleMapsDialogData {
  deliveryLocationLat: number;
  deliveryLocationLon: number;
}
@Component({
  selector: 'hub-shared-feature-google-maps-dialog',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatDialogModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  templateUrl: './shared-feature-google-maps-dialog.component.html',
  styleUrls: ['./shared-feature-google-maps-dialog.component.scss'],
})
export class SharedFeatureGoogleMapsDialogComponent {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  apiLoaded: Observable<boolean>;

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 14;
  display: google.maps.LatLngLiteral
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;
  constructor(
    public dialogRef: MatDialogRef<SharedFeatureGoogleMapsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GoogleMapsDialogData,
    @Inject(GOOGLE_MAPS_API_KEY) private googleMapsApiKey: string,
    httpClient: HttpClient,
    mapDirectionsService: MapDirectionsService
  ) {
    this.center = {
      lat: this.data.deliveryLocationLat,
      lng: this.data.deliveryLocationLon,
    };
    this.markerPositions.push(this.center);


    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`,
        'callback'
      )
      .pipe(
        map(() => true),
        tap((val) => {
          const request: google.maps.DirectionsRequest = {
            destination: {lat: this.data.deliveryLocationLat, lng: this.data.deliveryLocationLon},
            origin: {lat: 46.30828357545585, lng: 16.346560089618418},
            travelMode: google.maps.TravelMode.DRIVING
          };
          this.directionsResults$ = mapDirectionsService.route(request).pipe(map(response => response.result));
        }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

}
