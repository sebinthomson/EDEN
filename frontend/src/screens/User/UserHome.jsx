import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import EnglishAuctionCard from "../../components/User/EnglishAuctionCard";
import ReverseAuctionCard from "../../components/User/ReverseAuctionCard";
import { useListAuctionUserQuery } from "../../slices/userApiSlice";
import { useEffect, useState } from "react";

const UserHome = () => {
  const [englishAuctions, setEnglishAuctions] = useState([]);
  const [reverseAuctions, setReverseAuctions] = useState([]);
  const { data: auctions, error } = useListAuctionUserQuery();
  useEffect(() => {
    if (auctions?.auctions.englishAuctions)
      setEnglishAuctions(auctions?.auctions.englishAuctions.slice(0,4));
    if (auctions?.auctions.reverseAuctions)
      setReverseAuctions(auctions?.auctions.reverseAuctions.slice(0,5));
  }, [auctions]);
  const toast = useToast();
  if (error) {
    toast({
      title: `${error?.data?.message || error.error}`,
      status: `error`,
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <Flex px={10} pt={20} flexDirection={"column"}>
      <Box>
        <Text pl={{ md: "12" }} fontWeight={700}>
          English Auctions
        </Text>
      </Box>
      <Flex
        flexDirection={{ md: "row", base: "column" }}
        justifyContent={"space-between"}
      >
        {englishAuctions?.map((item, index) => (
          <EnglishAuctionCard key={index} item={item} />
        ))}
      </Flex>
      <Box>
        <Text pl={{ md: "12" }} fontWeight={700}>
          Reverse Auctions
        </Text>
      </Box>
      <Flex
        flexDirection={{ md: "row", base: "column" }}
        justifyContent={"space-between"}
        px={12}
      >
        {reverseAuctions.map((item, index) => (
          <ReverseAuctionCard key={index} item={item} />
        ))}
      </Flex>
    </Flex>
  );
};

export default UserHome;
