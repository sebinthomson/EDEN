import Logo from "./Logo";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.600", "white")}
      minH="50px"
      pt={{ base: 7 }}
      px={{ base: 50 }}
      borderBottom={2}
      borderStyle="solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Flex
        flex={{ base: 1, md: "auto" }}
        ml={{ base: -2 }}
        display={{ base: "flex", md: "none" }}
        justifyContent={{ base: "space-between" }}
      >
        <IconButton
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
          }
          variant="ghost"
          aria-label="Toggle Navigation"
        />
        <Text
          display={{ base: "flex", md: "none" }}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
          fontFamily="heading"
          color={useColorModeValue("gray.800", "white")}
        >
          <Logo />
        </Text>
      </Flex>
      <Flex
        flex={{ base: 1 }}
        justify={{ base: "center", md: "start" }}
        align="center"
      >
        <Text
          display={{ base: "none", md: "flex" }}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
          fontFamily="heading"
          color={useColorModeValue("gray.800", "white")}
        >
          <Logo />
        </Text>
        <Flex display={{ base: "none", md: "flex" }} ml={10} pb={0}>
          <DesktopNav />
        </Flex>
        <Stack flex={{ base: 1, md: 1 }} justify="flex-end" direction="row">
          <Button
            size="sm"
            as="a"
            display={{ base: "none", md: "inline-flex" }}
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="teal.400"
            onClick={() => navigate("/userLogin")}
            _hover={{ bg: "blue.700" }}
          >
            Login
          </Button>
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Box
                as="button"
                p={2}
                onClick={() => navigate(navItem.href)}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => (
  <Stack
    bg={useColorModeValue("white", "gray.800")}
    p={4}
    display={{ md: "none" }}
  >
    {NAV_ITEMS.map((navItem) => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
  </Stack>
);

// eslint-disable-next-line react/prop-types
const MobileNavItem = ({ label, href }) => {
  const navigate = useNavigate();
  return (
    <Stack spacing={4}>
      <Box
        py={2}
        as="button"
        onClick={() => navigate(href)}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
      </Box>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/userHome",
  },
  {
    label: "Auctions",
    href: "/userAuctions",
  },
  {
    label: "Sellers",
    href: "/userSellers",
  },
  {
    label: "Auctioning",
    href: "/userAuctioning",
  },
  {
    label: "Profile",
    href: "/userProfile",
  },
];

export default Navbar;
