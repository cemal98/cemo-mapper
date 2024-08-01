"use client";

import React from "react";
import { Heading, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { motion } from "framer-motion";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const Home = () => {
  return (
    <VStack
      spacing={4}
      justify="center"
      height="90vh"
      p={4}
      position="relative"
    >
      <div className="absolute inset-0">
        <Image
          className="object-cover "
          src="/assets/images/map.webp"
          alt="map"
          layout="fill"
          objectFit="cover"
          style={{ zIndex: -1 }}
        />
      </div>

      <VStack spacing={4} align="center" zIndex={1} position="relative">
        <MotionHeading
          className="text-center"
          mb={4}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to CemoMapper
        </MotionHeading>
        <MotionText
          fontSize="lg"
          textAlign="center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          This application allows you to manage and visualize locations on a
          map. You can add new locations, edit existing ones, and view routes
          between locations.
        </MotionText>
      </VStack>
    </VStack>
  );
};

export default Home;
