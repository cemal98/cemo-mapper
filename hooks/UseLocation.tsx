import { useState, useEffect } from "react";
import { Location } from "@/shared/interfaces/location.interface";
import { isLatLngTuple } from "@/config/helper";

const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  const updateLocation = (updatedLocation: Partial<Location>) => {
    if (selectedLocation) {
      const updatedData = {
        locationName:
          updatedLocation.locationName || selectedLocation.locationName,
        markerColor:
          updatedLocation.markerColor || selectedLocation.markerColor,
        position: updatedLocation.position
          ? isLatLngTuple(updatedLocation.position)
            ? {
                lat: updatedLocation.position[0],
                lng: updatedLocation.position[1],
              }
            : selectedLocation.position
          : selectedLocation.position,
      };

      const updatedLocations = locations.map((loc) =>
        loc.id === selectedLocation.id ? { ...loc, ...updatedData } : loc
      );

      setLocations(updatedLocations);
      localStorage.setItem("locations", JSON.stringify(updatedLocations));
      setSelectedLocation(null);
    }
  };

  return {
    locations,
    selectedLocation,
    setSelectedLocation,
    updateLocation,
  };
};

export default useLocations;
