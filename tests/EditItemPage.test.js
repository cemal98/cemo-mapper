import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditItem from "../app/locations/edit/[id]/page";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import useLocationsContext from "../contexts/useLocationContext";
import { useParams } from "next/navigation";
import { COLORS } from "@/constants/index";

jest.mock("@/components/Map", () => () => <div>DynamicMap Component</div>);

jest.mock("../contexts/useLocationContext", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

describe("EditItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render AddLocationAlert when no locations are present", async () => {
    useParams.mockReturnValue({ id: "1" });

    useLocationsContext.mockReturnValue({
      locations: [],
      selectedLocation: null,
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/locations/edit/1"]}>
        <Routes>
          <Route path="/locations/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No saved locations. Please add a location first.")
      ).toBeInTheDocument();
    });
  });

  it("should render DynamicMap when a location is present", async () => {
    useParams.mockReturnValue({ id: "1" });

    useLocationsContext.mockReturnValue({
      locations: [
        {
          id: "1",
          locationName: "Test Location",
          position: { lat: 0, lng: 0 },
          markerColor: COLORS.redMarker,
        },
      ],
      selectedLocation: {
        id: "1",
        locationName: "Test Location",
        position: { lat: 0, lng: 0 },
        markerColor: COLORS.redMarker,
      },
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/locations/edit/1"]}>
        <Routes>
          <Route path="/locations/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("DynamicMap Component")).toBeInTheDocument();
    });
  });

  it("should display the alert message when location is selected", async () => {
    useParams.mockReturnValue({ id: "1" });

    useLocationsContext.mockReturnValue({
      locations: [
        {
          id: "1",
          locationName: "Test Location",
          position: { lat: 0, lng: 0 },
          markerColor: COLORS.redMarker,
        },
      ],
      selectedLocation: {
        id: "1",
        locationName: "Test Location",
        position: { lat: 0, lng: 0 },
        markerColor: COLORS.redMarker,
      },
      setSelectedLocation: jest.fn(),
      updateLocation: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/locations/edit/1"]}>
        <Routes>
          <Route path="/locations/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Please edit by using drag and drop.")
      ).toBeInTheDocument();
    });
  });
});
