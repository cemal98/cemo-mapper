import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LocationListPage from "@/app/locations/list/page";
import "@testing-library/jest-dom";

jest.mock("@/components/AddLocationAlert", () => () => (
  <div>Add Location Alert</div>
));

jest.mock("@/utils/helpers/color.helper", () => ({
  getContrastingColor: jest.fn(() => "#000000"),
}));

const mockDeleteLocation = jest.fn();

jest.mock("@/contexts/useLocationContext", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

const {
  default: useLocationContext,
} = require("@/contexts/useLocationContext");

describe("LocationListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the LocationListPage component", () => {
    useLocationContext.mockReturnValue({
      locations: [
        {
          id: "1",
          locationName: "Location 1",
          markerColor: "#ff0000",
          position: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: "2",
          locationName: "Location 2",
          markerColor: "#00ff00",
          position: { lat: 34.0522, lng: -118.2437 },
        },
      ],
      deleteLocation: mockDeleteLocation,
    });

    render(<LocationListPage />);

    expect(screen.getByText("List Locations")).toBeInTheDocument();
    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
  });

  it("should delete a location when the delete button is clicked", async () => {
    useLocationContext.mockReturnValue({
      locations: [
        {
          id: "1",
          locationName: "Location 1",
          markerColor: "#ff0000",
          position: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: "2",
          locationName: "Location 2",
          markerColor: "#00ff00",
          position: { lat: 34.0522, lng: -118.2437 },
        },
      ],
      deleteLocation: mockDeleteLocation,
    });

    render(<LocationListPage />);

    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(mockDeleteLocation).toHaveBeenCalledWith("1");
    });
  });

  it("should show AddLocationAlert component when no locations are available", () => {
    useLocationContext.mockReturnValue({
      locations: [],
      deleteLocation: mockDeleteLocation,
    });

    render(<LocationListPage />);

    expect(screen.getByText("Add Location Alert")).toBeInTheDocument();
  });
});
