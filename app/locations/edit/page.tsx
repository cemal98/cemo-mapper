"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Text, useToast, Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { getContrastingColor, isLatLngTuple } from "@/config/helper";
import AddLocationAlert from "@/components/AddLocationAlert";
import { Mode } from "@/constants/enum";
import { Location } from "@/shared/interfaces/location.interface";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const EditLocationPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const toast = useToast();

  useEffect(() => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    } else {
      toast({
        title: "No Locations Found",
        description: "There are no locations saved to edit.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleLocationEdit = (updatedLocation: Partial<Location>) => {
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

      // Find the index of the selected location by ID
      const locationIndex = locations.findIndex(
        (loc) => loc.id === selectedLocation.id
      );

      if (locationIndex !== -1) {
        // Update the location at the found index
        const updatedLocations = locations.map((loc) =>
          loc.id === selectedLocation.id ? { ...loc, ...updatedData } : loc
        );

        // Update state and localStorage
        setLocations(updatedLocations);
        localStorage.setItem("locations", JSON.stringify(updatedLocations));

        setSelectedLocation(null);
      }
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Edit Locations</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <>
          <Box mb={4}>
            {locations.map((loc) => (
              <Button
                overflow={"hidden"}
                whiteSpace={"nowrap"}
                className="lg:!w-[140px] !w-[100px]"
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                m={1}
                color={getContrastingColor(loc.markerColor)}
                bg={loc.markerColor}
                _hover={{
                  bg: selectedLocation === loc ? loc.markerColor : "gray.300",
                }}
              >
                <span className="truncate">{loc.locationName}</span>
              </Button>
            ))}
          </Box>
          {selectedLocation ? (
            <DynamicMap
              mode={Mode.Edit}
              location={selectedLocation}
              onEdit={handleLocationEdit}
            />
          ) : (
            <Text>Select a location from the list above to edit.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default EditLocationPage;
