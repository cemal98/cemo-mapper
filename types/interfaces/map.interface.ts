import { Mode } from "@/types/enums/enum";
import { LatLngExpression } from "leaflet";
import { Location } from "./location.interface";

export interface MapProps {
  mode: Mode;
  location?: Location;
  onEdit?: (location: Location) => void;
  locations?: Location[];
}

export interface ResetCenterViewProps {
  center: LatLngExpression;
}
