import { LatLngExpression } from "leaflet";
import { Mode } from "../enums/enum";

export interface Location {
  id: string;
  position: LatLngExpression;
  locationName: string;
  markerColor: string;
}

export interface LocationContextType {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  updateLocation: (updatedLocation: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  saveLocation: (mode: Mode, locationData: Location) => void;
}
