"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Button,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Link from "next/link";

const LocationListPage = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
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
      <Grid
        className="md:!grid !flex flex-col-reverse"
        templateRows={selectedLocation ? "1fr auto" : "repeat(2, 1fr)"}
        templateColumns={
          selectedLocation ? { base: "1fr", md: "4fr 2fr" } : "1fr"
        }
        gap={4}
        p={4}
        overflow="hidden"
      >
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {locations.map((loc, idx) => (
            <Box
              key={idx}
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
                  <Box
                    width="20px"
                    height="20px"
                    onClick={() => setSelectedLocation(loc)}
                    cursor={"pointer"}
                    borderRadius="full"
                    backgroundColor={loc.markerColor}
                  />
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
                  <Link href={`/locations/edit/`}>
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
        {selectedLocation && (
          <Box
            p={4}
            borderWidth={1}
            height={"162px"}
            borderRadius="md"
            boxShadow="md"
            overflowY="auto"
          >
            <Text fontSize="xl" mb={4}>
              Location Details
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {selectedLocation.locationName}
            </Text>
            {selectedLocation.position ? (
              <>
                <Text fontSize="md">
                  Coordinates: {selectedLocation.position.lat.toFixed(2)},{" "}
                  {selectedLocation.position.lng.toFixed(2)}
                </Text>
                <Text fontSize="md" color={selectedLocation.markerColor}>
                  <div className="flex gap-3 items-center">
                    Marker Color:{" "}
                    <Box
                      width="20px"
                      height="20px"
                      borderRadius="full"
                      backgroundColor={selectedLocation.markerColor}
                    />
                  </div>
                </Text>
              </>
            ) : (
              <Text fontSize="md" color="red.500">
                Invalid coordinates
              </Text>
            )}
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default LocationListPage;
