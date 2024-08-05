import { LatLng, LatLngExpression, LatLngTuple } from "leaflet";

// Type guard
export const isLatLngTuple = (
  position: LatLngExpression
): position is LatLngTuple => {
  return Array.isArray(position) && position.length === 2;
};

export const isLatLng = (position: LatLngExpression): position is LatLng => {
  return (
    (position as LatLng).lat !== undefined &&
    (position as LatLng).lng !== undefined
  );
};
