/* eslint-disable react/prop-types */
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ReverseAuctionCard = ({ item }) => {
  const navigate = useNavigate();
  const handleAuctionDetails = () => {
    navigate("/userReverseAuctions/details", { state: { data: item } });
  };
  return (
    <Center pb={12}>
      <Box
        role={"group"}
        p={2}
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
        <Stack align={"center"}>
          <Text
            color={"gray.500"}
            fontSize={"sm"}
            textTransform={"uppercase"}
            whiteSpace={"nowrap"}
          >
            Buyer: {item.user.name}
          </Text>
          <Heading
            fontSize={"2xl"}
            fontFamily={"body"}
            fontWeight={500}
            whiteSpace={"nowrap"}
          >
            {item.item}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={600} fontSize={"sm"}>
              Quantity: {item.quantity}kg
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default ReverseAuctionCard;
