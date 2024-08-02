import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LocationListPage from "../../app/locations/list/page";

jest.mock("@/components/AddLocationAlert", () => () => (
  <div>Add Location Alert</div>
));
jest.mock("../../config/helper", () => ({
  getContrastingColor: jest.fn(() => "#000000"),
}));

describe("LocationListPage", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "locations",
      JSON.stringify([
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
      ])
    );
  });

  it("should render the LocationListPage component", async () => {
    render(<LocationListPage />);

    expect(screen.getByText("List Locations")).toBeInTheDocument();

    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
  });

  it("should delete a location when the delete button is clicked", async () => {
    render(<LocationListPage />);

    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(screen.queryByText("Location 1")).not.toBeInTheDocument();
      expect(screen.getByText("Location 2")).toBeInTheDocument();
    });
  });

  it("should show AddLocationAlert component when no locations are available", async () => {
    localStorage.setItem("locations", JSON.stringify([]));

    render(<LocationListPage />);

    expect(screen.getByText("Add Location Alert")).toBeInTheDocument();
  });
});
