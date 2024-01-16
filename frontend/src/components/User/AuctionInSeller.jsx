/* eslint-disable react/prop-types */
import {
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuctionInSeller = ({ auction, profile }) => {
  const [item, setItem] = useState();
  const navigate = useNavigate();
  const handleView = () => {
    auction.english
      ? navigate("/userEnglishAuctions/details", { state: { data: item } })
      : navigate("/userReverseAuctions/details", { state: { data: item } });
  };
  useEffect(() => {
    if (auction && profile) {
      const newObj = { ...auction };
      newObj.profile = profile;
      setItem(newObj);
    }
  }, [auction, profile]);
  return (
    <Flex p={2} onClick={handleView}>
      <Card
        maxW={"md"}
        minW={"md"}
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        alignItems={"center"}
      >
        {auction?.english && (
          <Image
            m={2}
            borderRadius="full"
            boxSize={{ md: "100px", base: "75px" }}
            src={`/Images/Auctions/${auction?.images[0]}`}
            alt="Profile Picture"
          />
        )}

        <Stack>
          <CardBody>
            <Heading size="md" mb={3}>
              {auction.item}
            </Heading>
            <Stack>
              <Flex flexDirection={"row"}>
                <Text fontWeight={"bold"}>{"Quantity: "}</Text>
                <Text> {auction.quantity} kg</Text>
              </Flex>
            </Stack>
          </CardBody>
        </Stack>
      </Card>
    </Flex>
  );
};

export default AuctionInSeller;
