import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MapView from "@/app/map/page";
import "@testing-library/jest-dom";

jest.mock("@/components/Map", () => () => <div>Map Component</div>);

describe("MapView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render AddLocationAlert when no locations are present", async () => {
    localStorage.removeItem("locations");

    render(<MapView />);

    await waitFor(() => {
      expect(
        screen.getByText("No saved locations. Please add a location first.")
      ).toBeInTheDocument();
    });
  });

  it("should render DynamicMap when locations are present", async () => {
    const dummyLocations = [
      {
        id: "1",
        locationName: "Test Location",
        position: { lat: 0, lng: 0 },
        markerColor: "#FF0000",
      },
    ];
    localStorage.setItem("locations", JSON.stringify(dummyLocations));

    render(<MapView />);

    await waitFor(() => {
      expect(screen.getByText("Map Component")).toBeInTheDocument();
    });
  });
});
