import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MapView from "@/app/map/page";
import "@testing-library/jest-dom";
import { COLORS } from "@/constants/index";

jest.mock("@/utils/helpers/color.helper", () => ({
  getContrastingColor: jest.fn(),
}));

jest.mock("@/components/Map", () => () => <div>Map Component</div>);

jest.mock("@/contexts/useLocationContext", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("MapView", () => {
  const mockUseLocationsContext =
    require("@/contexts/useLocationContext").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render AddLocationAlert when no locations are present", async () => {
    mockUseLocationsContext.mockReturnValue({
      locations: [],
    });

    render(<MapView />);

    await waitFor(() => {
      expect(
        screen.getByText("No saved locations. Please add a location first.")
      ).toBeInTheDocument();
    });
  });

  it("should render DynamicMap when locations are present", async () => {
    mockUseLocationsContext.mockReturnValue({
      locations: [
        {
          id: "1",
          locationName: "Test Location",
          position: { lat: 0, lng: 0 },
          markerColor: COLORS.redMarker,
        },
      ],
    });

    render(<MapView />);

    await waitFor(() => {
      expect(screen.getByText("Map Component")).toBeInTheDocument();
    });
  });
});
