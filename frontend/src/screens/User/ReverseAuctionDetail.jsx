"use client";

import {
  Box,
  Stack,
  Text,
  Flex,
  Heading,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ReverseAuctionDetail() {
  const [auction, setAuction] = useState();
  const location = useLocation();
  const { data } = location.state || {};
  useEffect(() => {
    setAuction(data);
  }, [data]);
  return (
    <Flex flexDirection={"row"} m={10}>
      <Stack spacing={{ base: 6, md: 10 }} mx={10}>
        <Box as={"header"}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          >
            {auction?.item}
          </Heading>
          <Text
            color={useColorModeValue("gray.900", "gray.400")}
            fontWeight={300}
            fontSize={"2xl"}
          >
            Quantity: {auction?.quantity}kg
          </Text>
        </Box>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={"column"}
          divider={
            <StackDivider
              borderColor={useColorModeValue("gray.200", "gray.600")}
            />
          }
        >
          <List spacing={2}>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                Auctioneer :
              </Text>{" "}
              {auction?.user.name}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                Starts On:
              </Text>{" "}
              {new Date(auction?.startsOn).toLocaleString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                Ends On:
              </Text>{" "}
              {new Date(auction?.endsOn).toLocaleString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </Flex>
  );
}
