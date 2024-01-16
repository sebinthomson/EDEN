/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex, Text } from "@chakra-ui/react";
import EnglishAuctionCard from "../../components/User/EnglishAuctionCard.jsx";
import ReverseAuctionCard from "../../components/User/ReverseAuctionCard.jsx";
import PaginationForFilter from "../../components/User/PaginationForFilter.jsx";
import { useEffect, useState } from "react";

const UserWatchlist = () => {
  const [english, setEnglish] = useState(true);
  const [response, setResponse] = useState([]);
  const [auction, setAuction] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6);
  const [total, setTotal] = useState(0);
  const fetchAuctions = ({ value }) => {
    // debugger;
    if (value) {
      const storedWatchlist = JSON.parse(
        localStorage.getItem("auctionWatchlistEnglish")
      );
      setResponse(storedWatchlist);
      setTotal(storedWatchlist?.length);
      setAuction(storedWatchlist?.slice(startIndex, endIndex));
    } else {
      const storedWatchlist = JSON.parse(
        localStorage.getItem("auctionWatchlistReverse")
      );
      setResponse(storedWatchlist);
      setTotal(storedWatchlist?.length);
      setAuction(storedWatchlist?.slice(startIndex, endIndex));
    }
  };
  useEffect(() => {
    setAuction(response?.slice(startIndex, endIndex));
  }, [startIndex, endIndex]);
  useEffect(() => {
    fetchAuctions({ value: true });
  }, []);
  console.log(total)
  return (
    <>
      <Flex justifyContent={"space-around"} m={5}>
        <Button
          size={"sm"}
          w={"49%"}
          onClick={() => {
            setEnglish(true);
            fetchAuctions({ value: true });
          }}
          bgColor={english ? "blue.300" : "blue.50"}
          color={english ? "white" : "black"}
          _hover={{ color: "black" }}
        >
          English Auction
        </Button>
        <Button
          size={"sm"}
          w={"49%"}
          onClick={() => {
            setEnglish(false);
            fetchAuctions({ value: false });
          }}
          bgColor={!english ? "blue.300" : "blue..50"}
          color={!english ? "white" : "black"}
          _hover={{ color: "black" }}
        >
          Reverse Auction
        </Button>
      </Flex>
      {!total && <Text ml={40} fontWeight={700} fontSize={"lg"} >No auctions added to watchlist</Text>}
      <Flex flexDirection={"row"} ml={10} justifyContent={"space-around"}>
        <Flex flexDirection={"column"}>
          {english && (
            <Flex
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={"flex-start"}
              flexWrap={"wrap"}
            >
              {auction?.map((item, index) => (
                <EnglishAuctionCard key={index} item={item} auctioneerPadding />
              ))}
            </Flex>
          )}
          {!english && (
            <Flex
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={"flex-start"}
              flexWrap={"wrap"}
            >
              {auction?.map((item, index) => (
                <Flex key={index} px={10}>
                  <ReverseAuctionCard item={item} auctioneerPadding />
                </Flex>
              ))}
            </Flex>
          )}
          <Flex className="hello" justifyContent={"space-evenly"} mt={"-25px"}>
            {total > 0 && (
              <PaginationForFilter
                setStartIndex={setStartIndex}
                setEndIndex={setEndIndex}
                total={total}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default UserWatchlist;
