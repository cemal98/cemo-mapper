import L from "leaflet";

// User icon properties
export const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Navigation links
export const navLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Add Location",
    route: "/locations/add",
  },
  {
    label: "List Locations",
    route: "/locations/list",
  },
  {
    label: "Edit Location",
    route: "/locations/edit",
  },
  {
    label: "Map View",
    route: "/map",
  },
];
