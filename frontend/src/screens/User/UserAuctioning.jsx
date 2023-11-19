import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const UserAuctioning = () => {
  const [value, setValue] = useState("1");
  return (
    <Flex
      direction="column"
      px={{ md: "12", base: "10" }}
      py={{ md: "6", base: "4" }}
    >
      <Text fontWeight={"bold"} pb="2">
        Select an Auction type
      </Text>
      <Box
        display={{ base: "flex", md: "flex" }}
        flexDirection={{ md: "row", base: "column" }}
        alignItems={{ md: "flex-end", base: "flex-start" }}
      >
        <Box>
          <RadioGroup
            onChange={setValue}
            value={value}
            display={{ md: "flex" }}
            flexDirection={{ md: "row" }}
            alignItems={{ md: "flex-end" }}
            spacing={{ md: "4" }}
          >
            <Stack direction="column" spacing={"4"}>
              <Box borderRadius={"lg"} bg={"blue.50"}>
                <Radio value="1" p={{ md: "2", base: "2" }}>
                  <Text fontWeight="bold">English Auction</Text>
                  <Text>{`An English Auction is a traditional and widely recognized type of
          auction in which the bidding starts at a relatively low price, and
          participants compete by placing progressively higher bids. The item or
          service being auctioned is awarded to the participant who has placed
          the highest bid when the bidding process concludes.`}</Text>
                </Radio>
              </Box>
              <Box borderRadius={"lg"} bg={"blue.50"}>
                <Radio value="2" p={{ md: "2" }}>
                  <Text fontWeight="bold">Reverse Auction</Text>
                  <Text>{`A Reverse Auction is a unique procurement method where a buyer posts a
          request for a product, and potential sellers or suppliers submit
          competitive bids to fulfill that request. The goal in a reverse
          auction is for sellers to offer the lowest possible price or the best
          terms for the buyer's specified requirements.`}</Text>
                </Radio>
              </Box>
            </Stack>
          </RadioGroup>
        </Box>
        <Box>
          <Button
            ml={{ md: "8" }}
            mt={{ base: "4" }}
            bgColor="blue.50"
            _hover={{ backgroundColor: "blue.400", color: "white" }}
          >
            Proceed with the selected Auction type
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default UserAuctioning;
