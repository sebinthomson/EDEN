/* eslint-disable react/prop-types */
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { calculateRating } from "../../config/AuctioneerLogics";

const SellerCard = ({ auctioneer }) => {
  const navigate = useNavigate();
  const handleDetails = () => {
    navigate("/UserSeller/details", { state: { data: auctioneer } });
  };
  return (
    <Flex p={2}>
      <Card
        onClick={handleDetails}
        maxW={"md"}
        minW={"md"}
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        alignItems={"center"}
      >
        <Stack className="hello" alignItems={"center"}>
          <Image
            m={2}
            borderRadius="full"
            boxSize={{ md: "100px", base: "75px" }}
            src={`/Images/Auctioneer/ProfileImage/${auctioneer?.profileImage}`}
            alt="Profile Picture"
          />
          <Text color={"black"} fontWeight={"700"}>
            {calculateRating(auctioneer?.user?.auctions).trim("").split("f")[0]}
          </Text>
        </Stack>

        <Stack>
          <CardBody>
            <Heading size="md" mb={3}>
              {auctioneer?.user?.name}
            </Heading>
            <Text mb={2}>
              <PhoneIcon /> {auctioneer?.mobileNumber}
            </Text>
            <Text mb={2} whiteSpace={""}>
              <EmailIcon /> {auctioneer?.user?.email}
            </Text>
            <Text mb={2}>
              <Icon as={FaLocationDot} /> {auctioneer?.location}
            </Text>
          </CardBody>
        </Stack>
      </Card>
    </Flex>
  );
};

export default SellerCard;
