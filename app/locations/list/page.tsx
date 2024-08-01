"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Button,
  useToast,
  IconButton,
  Tooltip,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { getContrastingColor } from "@/config/helper";
import AddLocationAlert from "@/components/AddLocationAlert";

const LocationListPage = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  const handleDeleteLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
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
            {locations.map((loc, idx) => (
              <Box
                key={loc.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
              >
                <Text fontSize="lg" fontWeight="bold">
                  <Box
                    display="flex"
                    gap={3}
                    className="h-[80px]"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    <Text flex="1" isTruncated>
                      {loc.locationName}
                    </Text>
                    <Tooltip
                      background={loc.markerColor}
                      color={getContrastingColor(loc.markerColor)}
                      label={
                        <>
                          {loc.position ? (
                            <>
                              Coordinates: {loc.position.lat?.toFixed(2)},{" "}
                              {loc.position.lng?.toFixed(2)}
                            </>
                          ) : (
                            "Invalid coordinates"
                          )}
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
                        onMouseEnter={() => setSelectedLocation(loc)}
                      />
                    </Tooltip>
                  </Box>
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLocation(idx);
                    }}
                  >
                    <Text className="lg:text-[14px] text-[12px]">Delete</Text>
                  </Button>
                  <div className="flex justify-end items-center">
                    <Link href={`/locations/edit/${loc.id}`}>
                      <IconButton
                        icon={<ArrowRightIcon />}
                        aria-label="Edit Location"
                      ></IconButton>
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
