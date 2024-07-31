import dynamic from "next/dynamic";
import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const AddLocationPage = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Add Location</Heading>
      <DynamicMap />
    </Box>
  );
};

export default AddLocationPage;
