/* eslint-disable no-unused-vars */
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Text,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { useLoadAuctioneerProfileQuery } from "../../slices/userApiSlice";
import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useProfileUpdateMutation } from "../../slices/userApiSlice";
import { setCredentials } from "../../slices/userAuthSlice";

const AuctioneerProfile = () => {
  const [profile, setProfile] = useState();
  const [mobileNumber, setMobileNumber] = useState(
    "Complete your profile setup"
  );
  const [location, setLocation] = useState("Complete your profile setup");
  const [profileImage, setProfileImage] = useState(false);
  const hiddenFileInput = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const dispatch = useDispatch();
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const [profileUpdateApiCall] = useProfileUpdateMutation();
  const { data: auctioneer, refetch } = useLoadAuctioneerProfileQuery({
    userId: userInfo._id,
  });
  useEffect(() => {
    if (auctioneer?.auctioneer == "Not Found") {
      setProfile(false);
    } else {
      setProfile(auctioneer);
    }
  }, [auctioneer, profile]);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleprofile = async () => {
    if (!profile && mobileNumber == "Complete your profile setup") {
      toast({
        title: "Please fill in your Mobile Number",
        status: `error`,
        duration: 4000,
        isClosable: true,
      });
    }
    if (!profile && location == "Complete your profile setup") {
      toast({
        title: "Please fill in your Location",
        status: `error`,
        duration: 4000,
        isClosable: true,
      });
    }
    if (!profile && !profileImage) {
      toast({
        title: "Please upload your photo",
        status: `error`,
        duration: 4000,
        isClosable: true,
      });
    }
    const formData = new FormData();
    formData.append("id", userInfo._id);
    formData.append("mobileNumber", mobileNumber);
    formData.append("location", location);
    formData.append("image", profileImage);
    const res = await profileUpdateApiCall(formData).unwrap();
    dispatch(setCredentials({ ...res[0].user }));
    onClose();
    refetch();
  };
  return (
    <Box>
      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {profile ? "Edit Profile" : "Complete Profile Setup"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  type="Number"
                  ref={initialRef}
                  placeholder="Enter your mobile number here"
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  type="String"
                  placeholder="Enter your place here"
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </FormControl>
              <ButtonGroup aria-label="Basic example" size="sm" pt={2}>
                <Button variant="secondary" onClick={handleClick}>
                  Update Profile Image
                </Button>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setProfileImage(file);
                  }}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                  name="image"
                ></Input>
              </ButtonGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleprofile();
                }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      <Flex
        bgColor={"gray.200"}
        justifyContent={{ md: "space-between" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Flex
          flexDirection={{ md: "row", base: "column" }}
          alignItems={{ base: "center" }}
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            m={{ md: "3rem", base: "1rem" }}
            gap={1}
          >
            <Image
              borderRadius="full"
              boxSize={{ md: "200px", base: "175px" }}
              src={
                profile
                  ? `/Images/Auctioneer/ProfileImage/${profile[0]?.profileImage}`
                  : "/Images/default.png"
              }
              alt="Profile Picture"
            />
            <Flex color={"gray"}>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              {/* <FaStarHalf /> */}
            </Flex>
            <Text color={"gray"} fontWeight={"700"}>
              {profile ? profile.rating / "5" : "-.-/-"}
            </Text>
          </Flex>
          <Flex
            flexDirection={"column"}
            justifyContent={{ md: "center" }}
            alignItems={{ base: "center", md: "flex-start" }}
            mb={{ base: "1rem" }}
            gap={1}
          >
            <Text fontSize={"xx-large"} fontWeight={"700"} pb={{ md: "10px" }}>
              {userInfo.name}
            </Text>
            <Flex alignItems={"center"}>
              <PhoneIcon mr={"10px"} />
              <Text>{profile ? profile[0]?.mobileNumber : mobileNumber}</Text>
            </Flex>
            <Flex alignItems={"center"}>
              <EmailIcon mr={"10px"} />
              <Text>{userInfo.email}</Text>
            </Flex>
            <Flex alignItems={"center"}>
              <Icon as={FaLocationDot} mr={"10px"} />
              <Text>{profile ? profile[0]?.location : location}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Button
          m={{ md: "5" }}
          mt={{ md: "18rem" }}
          size={"sm"}
          _hover={{ backgroundColor: "green.500", color: "white" }}
          onClick={onOpen}
        >
          {profile ? "Edit Profile" : "Complete Profile Setup"}
        </Button>
      </Flex>
    </Box>
  );
};

export default AuctioneerProfile;
