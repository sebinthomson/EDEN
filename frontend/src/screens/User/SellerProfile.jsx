/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import {
  calculateRating,
  compareDatesandReturn,
} from "../../config/AuctioneerLogics";
import AuctionInSeller from "../../components/User/AuctionInSeller.jsx";

const SellerProfile = () => {
  const [expiredEnglish, setExpiredEnglish] = useState([]);
  const [liveEnglish, setLiveEnglish] = useState([]);
  const [upcomingEnglish, setUpcomingEnglish] = useState([]);
  const [expiredReverse, setExpiredReverse] = useState([]);
  const [liveReverse, setLiveReverse] = useState([]);
  const [upcomingReverse, setUpcomingReverse] = useState([]);
  const [profile, setProfile] = useState();
  const location = useLocation();
  const { data } = location.state || {};
  const setAuctions = () => {
    if (data.user.auctions) {
      compareDatesandReturn(
        data.user.auctions,
        setExpiredEnglish,
        setLiveEnglish,
        setUpcomingEnglish,
        setExpiredReverse,
        setLiveReverse,
        setUpcomingReverse
      );
    }
  };
  useEffect(() => {
    if (data) {
      setProfile(data);
      setAuctions();
    }
  }, [data]);
  return (
    <Box>
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
                  ? `/Images/Auctioneer/ProfileImage/${profile?.profileImage}`
                  : "/Images/default.png"
              }
              alt="Profile Picture"
            />
            <Text color={"black"} fontWeight={"700"}>
              {calculateRating(profile?.user?.auctions)}
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
              {profile?.user?.name}
            </Text>
            <Flex alignItems={"center"}>
              <PhoneIcon mr={"10px"} />
              <Text>{profile?.mobileNumber}</Text>
            </Flex>
            <Flex alignItems={"center"}>
              <EmailIcon mr={"10px"} />
              <Text>{profile?.user?.email}</Text>
            </Flex>
            <Flex alignItems={"center"}>
              <Icon as={FaLocationDot} mr={"10px"} />
              <Text>{profile?.location}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Tabs isFitted variant="subtle">
        <TabList>
          <Tab
            _selected={{ bgColor: "blue.100", fontWeight: "bold" }}
            borderRadius={5}
          >
            English Auctions
          </Tab>
          <Tab
            _selected={{ bgColor: "blue.100", fontWeight: "bold" }}
            borderRadius={5}
          >
            Reverse Auctions
          </Tab>
        </TabList>
        <TabPanels mt={-3}>
          <TabPanel>
            <Tabs isFitted variant="subtle">
              <TabList>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Expired English Auctions
                </Tab>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Live English Auctions
                </Tab>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Upcoming English Auctions
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {expiredEnglish.length > 0 ? (
                      expiredEnglish.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>
                        No Expired English Auctions
                      </Text>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {liveEnglish.length > 0 ? (
                      liveEnglish.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>No Live English Auctions</Text>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {upcomingEnglish.length > 0 ? (
                      upcomingEnglish.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>
                        No Upcoming English Auctions
                      </Text>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs isFitted variant="subtle">
              <TabList>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Expired Reverse Auctions
                </Tab>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Live Reverse Auctions
                </Tab>
                <Tab
                  _selected={{ bgColor: "gray.100", fontWeight: "bold" }}
                  borderRadius={5}
                >
                  Upcoming Reverse Auctions
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {expiredReverse.length > 0 ? (
                      expiredReverse.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>
                        No Expired Reverse Auctions
                      </Text>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {liveReverse.length > 0 ? (
                      liveReverse.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>No Live Reverse Auctions</Text>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex wrap={"wrap"} mx={10} justifyContent={"space-between"}>
                    {upcomingReverse.length > 0 ? (
                      upcomingReverse.map((auction) => (
                        <AuctionInSeller key={auction._id} auction={auction} profile={profile}/>
                      ))
                    ) : (
                      <Text fontWeight={"bold"}>
                        No Upcoming Reverse Auctions
                      </Text>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SellerProfile;
