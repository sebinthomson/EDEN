/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EnglishAuctionCard = ({ item, auctioneerPadding }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleAuctionDetails = () => {
    navigate("/userEnglishAuctions/details", { state: { data: item } });
  };
  console.log(item?.images[0])
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={2}
        mx={10}
        maxW={"250px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
        onClick={handleAuctionDetails}
        _hover={{ cursor: "pointer" }}
      >
        {item && (
          <>
            <Box
              rounded={"lg"}
              mt={-12}
              pos={"relative"}
              height={"130px"}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              _after={{
                transition: "all .3s ease",
                content: '""',
                w: "full",
                h: "140",
                pos: "absolute",
                top: 5,
                left: 0,
                backgroundImage: `${item?.images[0]}`,
                filter: isHovered ? "blur(15px)" : "blur(10px)",
                zIndex: -1,
              }}
            >
              <Image
                rounded={"lg"}
                aspectRatio={5 / 4}
                objectFit={"cover"}
                src={item?.images[0]}
                alt="#"
              />
            </Box>
            <Stack pt={{ md: 10, base: 20 }} align={"center"}>
              {auctioneerPadding ? (
                <Text
                  color={"gray.500"}
                  fontSize={"sm"}
                  textTransform={"uppercase"}
                  mt={{ md: 10, base: -2 }}
                >
                  Auctioneer: {item?.user.name}
                </Text>
              ) : (
                <Text
                  color={"gray.500"}
                  fontSize={"sm"}
                  textTransform={"uppercase"}
                >
                  Auctioneer: {item?.user.name}
                </Text>
              )}
              <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                {item?.item}
              </Heading>
              <Stack direction={"row"} align={"center"}>
                <Text fontWeight={600} fontSize={"sm"}>
                  Quantity: {item?.quantity}kg
                </Text>
              </Stack>
            </Stack>
          </>
        )}
      </Box>
    </Center>
  );
};

export default EnglishAuctionCard;
