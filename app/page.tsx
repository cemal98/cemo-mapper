"use client";

import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Home = () => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh" p={4}>
      <Heading mb={4}>Welcome to CemoMapper</Heading>
      <Text fontSize="lg" textAlign="center">
        This application allows you to manage and visualize locations on a map.
        You can add new locations, edit existing ones, and view routes between
        locations.
      </Text>
    </VStack>
  );
};

export default Home;
