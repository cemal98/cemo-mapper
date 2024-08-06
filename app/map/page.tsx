"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Heading } from "@chakra-ui/react";
import AddLocationAlert from "@/components/AddLocationAlert";
import { Mode } from "@/types/enums/enum";
import useLocationsContext from "@/contexts/useLocationContext";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const MapView = () => {
  const { locations } = useLocationsContext();

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
