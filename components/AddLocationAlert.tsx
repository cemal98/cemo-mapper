import { Alert, AlertIcon } from "@chakra-ui/react";
import React from "react";

const AddLocationAlert = () => {
  return (
    <Alert status="info" mb={4} width="fit-content">
      <AlertIcon />
      No saved locations. Please add a location first.
    </Alert>
  );
};

export default AddLocationAlert;
