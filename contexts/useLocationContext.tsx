import { useContext } from "react";
import { LocationsContext } from "@/contexts/LocationsContext";

const useLocationsContext = () => {
  const context = useContext(LocationsContext);

  if (!context) {
    throw new Error(
      "useLocationsContext must be used within a LocationsProvider"
    );
  }

  return context;
};

export default useLocationsContext;
