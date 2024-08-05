import { useState, useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import { colors } from "@/utils/colors";
import { Mode } from "@/types/enums/enum";

const useMapLogic = (mode: string, location: any) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [userPosition, setUserPosition] = useState<LatLngExpression>([
    39.9334, 32.8597,
  ]);
  const [locationName, setLocationName] = useState("");
  const [markerColor, setMarkerColor] = useState(colors.markerDefault);
  const [routeControl, setRouteControl] = useState<L.Routing.Control | null>(
    null
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (mode === Mode.Edit && location) {
      setPosition(location.position);
      setLocationName(location.locationName);
      setMarkerColor(location.markerColor);
    }
  }, [mode, location]);

  return {
    position,
    setPosition,
    userPosition,
    setUserPosition,
    locationName,
    setLocationName,
    markerColor,
    setMarkerColor,
    routeControl,
    setRouteControl,
  };
};

export default useMapLogic;
