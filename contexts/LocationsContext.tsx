"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  Location,
  LocationContextType,
} from "@/types/interfaces/location.interface";
import { Mode } from "@/types/enums/enum";
import { isLatLngTuple } from "@/utils/helpers/type.helper";

const LocationsContext = createContext<LocationContextType | undefined>(
  undefined
);

const LocationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      const updatedData: Location = {
        id: selectedLocation.id,
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
        loc.id === selectedLocation.id ? updatedData : loc
      );
      setLocations(updatedLocations);
      localStorage.setItem("locations", JSON.stringify(updatedLocations));
      setSelectedLocation(null);
    }
  };

  const deleteLocation = (id: string) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
  };

  const saveLocation = (mode: Mode, locationData: Location) => {
    const updatedLocations =
      mode === Mode.Edit
        ? locations.map((loc) =>
            loc.id === locationData.id ? locationData : loc
          )
        : [...locations, locationData];

    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
  };

  return (
    <LocationsContext.Provider
      value={{
        locations,
        selectedLocation,
        setSelectedLocation,
        updateLocation,
        deleteLocation,
        saveLocation,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};

export { LocationsContext, LocationsProvider };
