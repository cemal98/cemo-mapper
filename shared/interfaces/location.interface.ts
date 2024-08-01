import { LatLngExpression } from "leaflet";

export interface Location {
  id: string;
  position: LatLngExpression;
  locationName: string;
  markerColor: string;
}
