/* eslint-disable react-hooks/exhaustive-deps */
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import EnglishAuctionCard from "../../components/User/EnglishAuctionCard.jsx";
import ReverseAuctionCard from "../../components/User/ReverseAuctionCard";
import { useState, useEffect } from "react";
import { useListAuctionUserQuery } from "../../slices/userApiSlice";

const UserAuctions = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [englishAuctions, setEnglishAuctions] = useState([]);
  const [reverseAuctions, setReverseAuctions] = useState([]);
  const { data: auctions } = useListAuctionUserQuery();
  let item = new Map();
  useEffect(() => {
    if (auctions?.auctions.englishAuctions) {
      setEnglishAuctions(auctions?.auctions.englishAuctions);
    }
    if (auctions?.auctions.reverseAuctions) {
      setReverseAuctions(auctions?.auctions.reverseAuctions);
    }
  }, [auctions, item]);
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
  if (tabIndex == 0) {
    englishAuctions.map((auction) => {
      if (!item.has(auction.item)) item.set(auction.item, false);
    });
  }
  return (
    <Tabs
      isFitted
      variant="soft-rounded"
      index={tabIndex}
      onChange={handleTabsChange}
    >
      <TabList>
        <Tab>English Auction</Tab>
        <Tab>Reverse Auction</Tab>
      </TabList>
      <TabPanels>
        {/* English Auctions */}
        <TabPanel m={2}>
          <Flex flexDirection={"row"}>
            <Flex maxW={{ md: 48 }} minW={{ md: 48 }}>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Text whiteSpace={"nowrap"}>Item</Text>
                    <AccordionIcon ml={{ md: 32 }} />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <CheckboxGroup>
                      <Stack>
                        {Array.from(item.entries()).map(([key, value]) => (
                          <Checkbox
                            key={key}
                            onChange={() => {
                              value
                                ? item.set(key, false)
                                : item.set(key, true);
                            }}
                          >
                            {key}
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
            <Flex
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={"space-between"}
              flexWrap={"wrap"}
            >
              {englishAuctions?.map((item, index) => (
                <EnglishAuctionCard key={index} item={item} auctioneerPadding />
              ))}
            </Flex>
          </Flex>
        </TabPanel>
        {/* Reverse Auctions */}
        <TabPanel m={2}>
          <Flex
            flexDirection={{ md: "row", base: "column" }}
            justifyContent={"space-between"}
          >
            {reverseAuctions.map((item, index) => (
              <ReverseAuctionCard key={index} item={item} />
            ))}
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default UserAuctions;
