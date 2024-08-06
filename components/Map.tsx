import React, { useEffect } from "react";
import L from "leaflet";
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
} from "@/types/interfaces/map.interface";
import { Mode } from "@/types/enums/enum";
import { Location } from "@/types/interfaces/location.interface";
import { FaMapMarker } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import useMapLogic from "@/hooks/useMapLogic";
import useLocationsContext from "../contexts/useLocationContext";
import { COLORS } from "@/constants/index";
import { createRoutingControl } from "@/utils/helpers/map.helper";
import { isLatLng } from "@/utils/helpers/type.helper";

const Map = ({ mode, location, onEdit, locations = [] }: MapProps) => {
  const { saveLocation } = useLocationsContext();
  const {
    position,
    setPosition,
    userPosition,
    locationName,
    setLocationName,
    markerColor,
    setMarkerColor,
    routeControl,
    setRouteControl,
  } = useMapLogic(mode, location);

  const toast = useToast();
  const iconSvg = renderToStaticMarkup(
    <FaMapMarker size={30} color={COLORS.primary} />
  );

  const LocationMarker = () => {
    const map = useMap();

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
      }

      createRoutingControl(
        map,
        userPosition,
        loc.position,
        loc.markerColor,
        setRouteControl
      );
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
          <Marker
            position={userPosition}
            icon={L.divIcon({
              className: "custom-icon",
              html: iconSvg,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          />
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
    const id = mode === Mode.Add ? uuidv4() : location?.id || "";

    const locationData: Location = {
      id,
      position: positionArray,
      locationName,
      markerColor,
    };

    saveLocation(mode, locationData);

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
    setMarkerColor(COLORS.markerDefault);
    setPosition(null);

    if (onEdit) {
      onEdit(locationData);
    }
  };

  const isSaveButtonDisabled = () => {
    if (mode === Mode.Edit && location) {
      return (
        position?.toString() === location.position.toString() &&
        locationName === location.locationName &&
        markerColor === location.markerColor
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
