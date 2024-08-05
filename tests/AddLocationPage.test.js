import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AddLocationPage from "../app/locations/add/page";

jest.mock("@/components/Map", () => () => <div>Map Component</div>);

describe("AddLocationPage", () => {
  it("should render the AddLocationPage component", async () => {
    render(<AddLocationPage />);

    await waitFor(() => {
      expect(screen.getByText("Add Location")).toBeInTheDocument();
      expect(screen.getByText("Map Component")).toBeInTheDocument();
    });
  });
});
