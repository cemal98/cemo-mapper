"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Button,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { getContrastingColor } from "@/utils/helpers/color.helper";
import AddLocationAlert from "@/components/AddLocationAlert";
import useLocationsContext from "@/contexts/useLocationContext";
import { isLatLng } from "@/utils/helpers/type.helper";

const LocationListPage = () => {
  const { locations, deleteLocation } = useLocationsContext();
  const toast = useToast();

  const handleDeleteLocation = (id: string) => {
    deleteLocation(id);
    toast({
      title: "Location Deleted",
      description: "The location has been removed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Heading mb={4}>List Locations</Heading>
      {locations.length === 0 ? (
        <AddLocationAlert />
      ) : (
        <Grid gap={4} p={4} overflow="hidden">
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {locations.map((loc) => (
              <Box
                key={loc.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
              >
                <Box fontSize="lg" fontWeight="bold">
                  <div className="h-[80px] flex overflow-hidden text-nowrap gap-1">
                    <Text flex="1" isTruncated>
                      {loc.locationName}
                    </Text>
                    <Tooltip
                      background={loc.markerColor}
                      color={getContrastingColor(loc.markerColor)}
                      label={
                        <>
                          <div className="flex gap-1">
                            <Text>Coordinates:</Text>
                            {isLatLng(loc.position) ? (
                              <>
                                <Text>{loc.position.lat.toFixed(2)}</Text>
                                <Text>,{loc.position.lng.toFixed(2)}</Text>
                              </>
                            ) : (
                              <Text>Invalid coordinates</Text>
                            )}
                          </div>
                        </>
                      }
                      placement="right"
                      hasArrow
                    >
                      <Box
                        width="20px"
                        height="20px"
                        borderRadius="full"
                        backgroundColor={loc.markerColor}
                        cursor="pointer"
                      />
                    </Tooltip>
                  </div>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Button
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLocation(loc.id);
                    }}
                  >
                    <Text className="lg:text-[14px] text-[12px]">Delete</Text>
                  </Button>
                  <div className="flex justify-end items-center">
                    <Link href={`/locations/edit/${loc.id}`}>
                      <IconButton
                        icon={<ArrowRightIcon />}
                        aria-label="Edit Location"
                      />
                    </Link>
                  </div>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default LocationListPage;
