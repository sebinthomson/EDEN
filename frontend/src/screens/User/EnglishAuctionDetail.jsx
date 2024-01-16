/* eslint-disable react-hooks/exhaustive-deps */
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
  Button,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-carousel-minimal";
import SingleChat from "../../components/User/SingleChat";
import Countdown from "../../components/User/Countdown";
import AuctionOver from "../../components/User/AuctionOver.jsx";
import { IoEyeSharp } from "react-icons/io5";
import { setAuctionWatchlist } from "../../slices/auctionWatchlistEnglishSlice.js";
import { useDispatch } from "react-redux";

export default function EnglishAuctionDetail() {
  const [watchlist, setWatchlist] = useState();
  const [watchlistButton, setWatchlistButton] = useState(true);
  const [auction, setAuction] = useState();
  const [timeDifference, setTimeDifference] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  let Imagesdata = [];
  for (let i = 0; i < auction?.images.length; i++) {
    Imagesdata.push({
      image: `/Images/Auctions/${auction?.images[i]}`,
    });
  }
  useEffect(() => {
    setAuction(data);
    const endsOnTime = new Date(data?.endsOn).getTime();
    const currentTime = Date.now();
    const difference = endsOnTime - currentTime;
    setTimeDifference(difference);
    const storedWatchlist = JSON.parse(
      localStorage.getItem("auctionWatchlistEnglish")
    );
    setWatchlist(storedWatchlist);
    if (storedWatchlist && auction) {
      storedWatchlist.map((auct) => {
        if (auct?._id == auction._id) setWatchlistButton(false);
      });
    }
  }, [data, auction]);
  const handleWatchlist = () => {
    if (watchlistButton) {
      if (watchlist?.length > 0) {
        dispatch(setAuctionWatchlist([...watchlist, auction]));
      } else {
        dispatch(setAuctionWatchlist([auction]));
      }
      setWatchlistButton(false);
    } else {
      if (watchlist?.length > 0) {
        const watchlistauctions = watchlist.filter(
          (auct) => auct._id !== auction._id
        );
        dispatch(setAuctionWatchlist([...watchlistauctions]));
      } else {
        dispatch(setAuctionWatchlist([]));
      }
      setWatchlistButton(true);
    }
  };
  return (
    <Flex flexDirection={{ md: "row", base: "column" }} m={10}>
      <Box>
        {Imagesdata.length && (
          <Carousel
            data={Imagesdata}
            time={2000}
            height={300}
            width={450}
            radius="10px"
            captionPosition="bottom"
            automatic={true}
            dots={true}
            pauseIconColor="white"
            pauseIconSize="40px"
            slideBackgroundColor="darkgrey"
            slideImageFit="cover"
            thumbnails={true}
            thumbnailWidth="100px"
          />
        )}
      </Box>

      <Stack spacing={{ base: 6, md: 10 }} mx={10}>
        <Box as={"header"}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          >
            {auction?.item}
          </Heading>
          <Flex
            mt={2}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"flex-end"}
          >
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"2xl"}
              whiteSpace={"nowrap"}
            >
              Quantity: {auction?.quantity}kg
            </Text>
            <Button ml={2} size={"sm"} onClick={handleWatchlist}>
              <Icon as={IoEyeSharp} boxSize={5} mr={1}></Icon>
              {watchlistButton ? "Add to watchlist" : "Remove from watchlist"}
            </Button>
          </Flex>
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
              {auction?.user?.name || auction?.profile?.user?.name}
            </ListItem>
            <ListItem>
              <Text as={"span"} fontWeight={"bold"}>
                Starting Bid:
              </Text>
              {" Rs. "}
              {auction?.startingBid}
              {"/-"}
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
              <Text
                as={"span"}
                fontWeight={timeDifference > 0 ? "bold" : "400"}
              >
                {timeDifference > 0
                  ? "Ends In:"
                  : `Auction Ended at ${new Date(
                      auction?.endsOn
                    ).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`}
              </Text>{" "}
              {timeDifference > 0 && (
                <Countdown
                  timeDifference={timeDifference}
                  setTimeDifference={setTimeDifference}
                />
              )}
            </ListItem>
          </List>
        </Stack>
      </Stack>
      {timeDifference > 0 ? (
        <SingleChat AuctionId={auction?._id} />
      ) : (
        <AuctionOver AuctionId={auction?._id} englishAuction />
      )}
    </Flex>
  );
}
