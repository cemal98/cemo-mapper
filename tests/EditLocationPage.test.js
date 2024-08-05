import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditLocationPage from "@/app/locations/edit/page";
import useLocationsContext from "@/contexts/useLocationContext";
import { getContrastingColor } from "@/utils/helpers/color.helper";

jest.mock("@/components/Map", () => () => <div>Map Component</div>);
jest.mock("@/components/AddLocationAlert", () => () => (
  <div>Add Location Alert</div>
));
jest.mock("@/contexts/useLocationContext", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/utils/helpers/color.helper", () => ({
  getContrastingColor: jest.fn(),
}));

describe("EditLocationPage", () => {
  beforeEach(() => {
    useLocationsContext.mockReturnValue({
      locations: [
        { id: "1", locationName: "Location 1", markerColor: "#ff0000" },
        { id: "2", locationName: "Location 2", markerColor: "#00ff00" },
      ],
      selectedLocation: null,
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });
    getContrastingColor.mockImplementation(() => "#ffffff");
  });

  it("should render the EditLocationPage component with AddLocationAlert when locations are empty", () => {
    useLocationsContext.mockReturnValue({
      locations: [],
      selectedLocation: null,
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });

    render(<EditLocationPage />);

    expect(screen.getByText("Add Location Alert")).toBeInTheDocument();
  });

  it("should render the EditLocationPage component with location buttons when locations are available", () => {
    render(<EditLocationPage />);

    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
  });

  it("should render DynamicMap when a location is selected", async () => {
    useLocationsContext.mockReturnValue({
      locations: [
        { id: "1", locationName: "Location 1", markerColor: "#ff0000" },
      ],
      selectedLocation: {
        id: "1",
        locationName: "Location 1",
        markerColor: "#ff0000",
      },
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });

    render(<EditLocationPage />);

    await waitFor(() => {
      expect(screen.getByText("Map Component")).toBeInTheDocument();
    });
  });

  it("should show the select location message when no location is selected", () => {
    render(<EditLocationPage />);

    expect(
      screen.getByText("Select a location from the list above to edit.")
    ).toBeInTheDocument();
  });
});