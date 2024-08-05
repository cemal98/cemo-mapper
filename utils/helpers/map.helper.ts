import L from "leaflet";

export const createRoutingControl = (
  map: L.Map,
  userPosition: L.LatLngExpression,
  locPosition: L.LatLngExpression,
  markerColor: string,
  setRouteControl: React.Dispatch<
    React.SetStateAction<L.Routing.Control | null>
  >
) => {
  const newRoute = L.Routing.control({
    waypoints: [L.latLng(userPosition), L.latLng(locPosition)],
    routeWhileDragging: true,
    containerClassName: "leaflet-routing-container-custom",
    lineOptions: {
      extendToWaypoints: true,
      missingRouteTolerance: 5,
      styles: [{ color: markerColor, weight: 5, opacity: 0.7 }],
    },
  }).addTo(map);

  setRouteControl(newRoute);
};
