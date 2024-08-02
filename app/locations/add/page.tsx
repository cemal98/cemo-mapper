"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Mode } from "../../../constants/enum";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

const AddLocationPage = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Add Location</Heading>
      <DynamicMap mode={Mode.Add} />
    </Box>
  );
};

export default AddLocationPage;
