import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../app/page";

test("renders welcome message", () => {
  render(<Home />);
  const headingElement = screen.getByText(/Welcome to CemoMapper/i);
  expect(headingElement).toBeInTheDocument();
});
