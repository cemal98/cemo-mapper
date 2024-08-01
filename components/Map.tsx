import React, { useState, useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet-routing-machine";
import { v4 as uuidv4 } from "uuid";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import { Box, Input, Button, HStack, VStack, useToast } from "@chakra-ui/react";
import {
  MapProps,
  ResetCenterViewProps,
} from "@/shared/interfaces/map.interface";
import { Mode } from "@/constants/enum";
import { Location } from "@/shared/interfaces/location.interface";
import { userIcon } from "@/constants";
import { isLatLng } from "@/config/helper";

const defaultPosition: LatLngExpression = [39.9334, 32.8597];

const Map = ({ mode, location, onEdit, locations = [] }: MapProps) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [userPosition, setUserPosition] =
    useState<LatLngExpression>(defaultPosition);
  const [locationName, setLocationName] = useState("");
  const [markerColor, setMarkerColor] = useState("#000000");
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [initialLocationData, setInitialLocationData] =
    useState<Location | null>(null);
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
    if (mode === Mode.Edit && location) {
      setPosition(location.position);
      setLocationName(location.locationName);
      setMarkerColor(location.markerColor);
      setInitialLocationData(location);
    }
  }, [mode, location]);

  const LocationMarker = () => {
    const map = useMap();
    const [routeControl, setRouteControl] = useState<L.Routing.Control | null>(
      null
    );

    useMapEvents({
      click(e) {
        if (mode === Mode.Add) {
          setPosition(e.latlng);
        }
      },
    });

    const handleMarkerClick = (loc: Location) => {
      if (routeControl) {
        map.removeControl(routeControl);
        setRouteControl(null);
      }

      const newRoute = L.Routing.control({
        waypoints: [L.latLng(userPosition), L.latLng(loc.position)],
        routeWhileDragging: true,
        createMarker: () => null,
        containerClassName: "leaflet-routing-container-custom",
        lineOptions: {
          extendToWaypoints: true,
          missingRouteTolerance: 5,
          styles: [{ color: loc.markerColor, weight: 5, opacity: 0.7 }],
        },
      }).addTo(map);

      setRouteControl(newRoute);
    };

    return (
      <>
        {mode === Mode.View &&
          locations.map((loc) => (
            <Marker
              key={loc.id}
              position={loc.position}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<div style="background-color: ${loc.markerColor}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
              })}
              eventHandlers={{ click: () => handleMarkerClick(loc) }}
            >
              <Popup className="custom-popup">
                <div>
                  Coordinates:{" "}
                  {isLatLng(loc.position) ? (
                    <>
                      {loc.position.lat.toFixed(2)},{" "}
                      {loc.position.lng.toFixed(2)}
                    </>
                  ) : (
                    "Invalid coordinates"
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {position && mode !== Mode.View && (
          <Marker
            position={position}
            draggable={mode === Mode.Edit}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
            })}
            eventHandlers={
              mode === Mode.Edit
                ? {
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      setPosition([lat, lng]);
                    },
                  }
                : undefined
            }
          />
        )}
        {mode === Mode.View && userPosition && (
          <Marker position={userPosition} icon={userIcon} />
        )}
      </>
    );
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
    const id = mode === Mode.Add ? uuidv4() : initialLocationData?.id || "";

    const locationData = {
      id,
      position: positionArray,
      locationName,
      markerColor,
    };

    const updatedLocations =
      mode === Mode.Edit
        ? savedLocations.map((loc) =>
            loc.id === location?.id ? locationData : loc
          )
        : [...savedLocations, locationData];

    setSavedLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));

    toast({
      title: "Success",
      description:
        mode === Mode.Add
          ? "Location saved successfully!"
          : "Location updated successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLocationName("");
    setMarkerColor("#000000");
    setPosition(null);

    if (onEdit) {
      onEdit(locationData);
    }
  };

  const isSaveButtonDisabled = () => {
    if (mode === Mode.Edit && initialLocationData) {
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
      {(mode === Mode.Add || mode === Mode.Edit) && (
        <HStack align="center" wrap="wrap" justify="space-between">
          <div className="flex gap-2 lg:w-[600px] md:w-[400px]">
            <Input
              className="md:!text-[14px] !text-[10px]"
              placeholder="Location Name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <Input
              type="color"
              value={markerColor}
              onChange={(e) => setMarkerColor(e.target.value)}
              width="50px"
              className="!p-1"
            />
          </div>
          <HStack>
            <Button
              className="md:!text-[14px] !text-[10px]"
              onClick={handleSaveLocation}
              isDisabled={isSaveButtonDisabled()}
            >
              {mode === Mode.Add ? "Save Location" : "Update Location"}
            </Button>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

const ResetCenterView = ({ center }: ResetCenterViewProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

export default Map;
