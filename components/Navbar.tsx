"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { navLinks } from "@/constants";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position="sticky" top="0" zIndex="1000">
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onOpen}
            icon={<HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "end", md: "start", sm: "end" }}
        >
          <Text
            textAlign={useBreakpointValue({ base: "end", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            <Image
              src="/assets/images/logo-icon.webp"
              alt="logo"
              className="rounded-[30px] flex items-center"
              width={35}
              height={37}
            />
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigation</DrawerHeader>
            <DrawerBody>
              <MobileNav onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  return (
    <Stack
      direction={"row"}
      className="justify-center flex lg:w-[1200px]"
      spacing={4}
    >
      {navLinks.map((navItem, idx) => (
        <Box
          as="a"
          key={idx}
          p={2}
          href={navItem.route}
          fontSize={"sm"}
          fontWeight={500}
          color={linkColor}
          _hover={{
            textDecoration: "none",
            color: linkHoverColor,
          }}
        >
          {navItem.label}
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  return (
    <Stack bg={useColorModeValue("white", "gray.800")} display={{ md: "none" }}>
      {navLinks.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  route,
  onClose,
}: NavItem & { onClose: () => void }) => {
  return (
    <Box
      as="a"
      href={route}
      justifyContent="space-between"
      alignItems="center"
      _hover={{ textDecoration: "none" }}
      onClick={onClose}
    >
      <Text
        className="py-2 hover:bg-gray-200 hover:rounded-[20px]"
        fontWeight={600}
        color={useColorModeValue("gray.600", "gray.200")}
      >
        <span className="truncate px-2">{label}</span>
      </Text>
    </Box>
  );
};

interface NavItem {
  label: string;
  route: string;
}

export default Navbar;
