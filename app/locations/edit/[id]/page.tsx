"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Alert, AlertIcon, Box, Heading, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Mode } from "@/constants/enum";
import AddLocationAlert from "@/components/AddLocationAlert";
import useLocations from "@/hooks/UseLocation";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const EditItem = () => {
  const { id } = useParams();
  const { locations, selectedLocation, setSelectedLocation, updateLocation } =
    useLocations();

  useEffect(() => {
    if (id && locations.length > 0) {
      const location = locations.find((loc) => loc.id === id);
      if (location) {
        setSelectedLocation(location);
      }
    }
  }, [id, locations]);

  return (
    <Box p={4}>
      <Heading mb={4}>Edit Location</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <>
          <Alert status="info" mb={4} width="fit-content">
            <AlertIcon />
            Please edit by using drag and drop.
          </Alert>
          {selectedLocation ? (
            <DynamicMap
              mode={Mode.Edit}
              location={selectedLocation}
              onEdit={updateLocation}
            />
          ) : (
            <Text>
              Select a location from the list above or use the URL to edit a
              specific location.
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default EditItem;
