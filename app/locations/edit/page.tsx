"use client";

import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { getContrastingColor } from "@/config/helper";
import AddLocationAlert from "@/components/AddLocationAlert";
import { Mode } from "@/constants/enum";
import Link from "next/link";
import useLocations from "@/hooks/UseLocation";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const EditLocationPage = () => {
  const { locations, selectedLocation, setSelectedLocation, updateLocation } =
    useLocations();

  return (
    <Box p={4}>
      <Heading mb={4}>Edit Locations</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <>
          <Box mb={4}>
            {locations.map((loc) => (
              <Link href={`/locations/edit/${loc.id}`} key={loc.id}>
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
              </Link>
            ))}
          </Box>
          {selectedLocation ? (
            <DynamicMap
              mode={Mode.Edit}
              location={selectedLocation}
              onEdit={updateLocation}
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
