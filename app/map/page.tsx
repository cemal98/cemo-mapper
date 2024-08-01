"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Heading, useToast } from "@chakra-ui/react";
import AddLocationAlert from "@/components/AddLocationAlert";
import { Mode } from "@/constants/enum";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const MapView = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  return (
    <Box p={4}>
      <Heading mb={4}>Map View</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <DynamicMap mode={Mode.View} locations={locations} />
      )}
    </Box>
  );
};

export default MapView;
