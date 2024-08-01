import React, { useState, useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import { v4 as uuidv4 } from "uuid";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Box, Input, Button, HStack, VStack, useToast } from "@chakra-ui/react";

const defaultPosition: LatLngExpression = [39.9334, 32.8597];

const Map = ({
  mode,
  location,
  onEdit,
}: {
  mode: string;
  location?: any;
  onEdit?: (location: any) => void;
}) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [userPosition, setUserPosition] =
    useState<LatLngExpression>(defaultPosition);
  const [locationName, setLocationName] = useState("");
  const [markerColor, setMarkerColor] = useState("#000000");
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [initialLocationData, setInitialLocationData] = useState<any | null>(
    null
  );
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

  useEffect(() => {
    if (mode === "edit" && location) {
      setPosition(location.position as LatLngExpression);
      setLocationName(location.locationName);
      setMarkerColor(location.markerColor);
      setInitialLocationData(location);
    }
  }, [mode, location]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (mode === "add") {
          setPosition(e.latlng);
        }
      },
    });

    return position ? (
      <Marker
        position={position}
        draggable={mode === "edit"}
        icon={L.divIcon({
          className: "custom-marker",
          html: `<p><div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%;"></div></p>`,
        })}
        eventHandlers={
          mode === "edit"
            ? {
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setPosition([lat, lng] as LatLngExpression);
                },
              }
            : undefined
        }
      />
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

    const positionArray = position as [number, number];
    const id = mode === "add" ? uuidv4() : initialLocationData?.id || "";

    const locationData = {
      id,
      position: positionArray,
      locationName,
      markerColor,
    };

    if (mode === "edit" && location) {
      // Update the existing location
      const updatedLocations = savedLocations.map((loc) =>
        loc.id === location.id ? locationData : loc
      );
      setSavedLocations(updatedLocations);
      localStorage.setItem("locations", JSON.stringify(updatedLocations));

      toast({
        title: "Success",
        description: "Location updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (mode === "add") {
      // Add new location
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
    }

    setLocationName("");
    setMarkerColor("#000000");
    setPosition(null);

    if (onEdit) {
      onEdit(locationData);
    }
  };

  const isSaveButtonDisabled = () => {
    if (mode === "edit" && initialLocationData) {
      return (
        position?.toString() === initialLocationData.position.toString() &&
        locationName === initialLocationData.locationName &&
        markerColor === initialLocationData.markerColor
      );
    }
    return false;
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
        </MapContainer>
      </Box>
      {(mode === "add" || mode === "edit") && (
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
            <Button
              onClick={handleSaveLocation}
              isDisabled={isSaveButtonDisabled()}
            >
              {mode === "add" ? "Save Location" : "Update Location"}
            </Button>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

const ResetCenterView = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

export default Map;
