const isClient = typeof window !== "undefined";

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
