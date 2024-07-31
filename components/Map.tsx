"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Box, Input, Button, VStack, HStack, useToast } from "@chakra-ui/react";
import L from "leaflet";

const defaultPosition: L.LatLngExpression = [39.9334, 32.8597];

const Map = () => {
  const [position, setPosition] = useState<L.LatLngExpression | null>(null);
  const [userPosition, setUserPosition] =
    useState<L.LatLngExpression>(defaultPosition);
  const [locationName, setLocationName] = useState("");
  const [markerColor, setMarkerColor] = useState("#000000");
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      });
    }

    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setSavedLocations(JSON.parse(storedLocations));
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position ? (
      <Marker
        position={position}
        icon={L.divIcon({
          className: "custom-marker",
          html: `<p><div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%;"></div></p>`,
        })}
      ></Marker>
    ) : null;
  };

  const handleSaveLocation = () => {
    if (!position || !locationName) {
      toast({
        title: "Error",
        description: "Please select a location and enter a name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Convert position to a more specific type
    const positionArray = position as [number, number];

    // Check if the location already exists
    const locationExists = savedLocations.some(
      (loc) =>
        loc.position[0] === positionArray[0] &&
        loc.position[1] === positionArray[1] &&
        loc.locationName === locationName
    );

    if (locationExists) {
      toast({
        title: "Location Exists",
        description:
          "This location already exists. Please select a different location.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const locationData = {
      position: positionArray,
      locationName,
      markerColor,
    };

    const updatedLocations = [...savedLocations, locationData];
    setSavedLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));

    toast({
      title: "Success",
      description: "Location saved successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLocationName("");
    setMarkerColor("#000000");
    setPosition(null);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box height="400px" width="100%">
        <MapContainer
          center={userPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
          {userPosition && <ResetCenterView center={userPosition} />}
          {savedLocations.map((loc, idx) => (
            <Marker
              key={idx}
              position={loc.position as L.LatLngExpression}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<p><div style="background-color: ${loc.markerColor}; width: 12px; height: 12px; border-radius: 50%;"></div></p>`,
              })}
            />
          ))}
        </MapContainer>
      </Box>
      <HStack spacing={4} align="center" wrap="wrap" justify="space-between">
        <Input
          placeholder="Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          width={{ base: "100%", md: "auto" }}
          flex={1}
        />
        <HStack spacing={4}>
          <Input
            type="color"
            value={markerColor}
            onChange={(e) => setMarkerColor(e.target.value)}
            width="50px"
            className="!p-1"
          />
          <Button onClick={handleSaveLocation}>Save Location</Button>
        </HStack>
      </HStack>
    </VStack>
  );
};

const ResetCenterView = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

export default Map;
