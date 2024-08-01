"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Alert, AlertIcon, Box, Heading, useToast } from "@chakra-ui/react";
import AddLocationAlert from "@/components/AddLocationAlert";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const MapView = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    } else {
      toast({
        title: "No Locations Found",
        description: "There are no locations saved.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  return (
    <Box p={4}>
      <Heading mb={4}>Map View</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <DynamicMap mode="view" locations={locations} />
      )}
    </Box>
  );
};

export default MapView;