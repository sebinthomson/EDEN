/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import SellerCard from "../../components/User/SellerCard";
import { useListAuctioneersUserQuery } from "../../slices/userApiSlice.js";
import { useEffect, useState } from "react";
import PaginationForFilter from "../../components/User/PaginationForFilter.jsx";
import {
  sortUsersHighToLow,
  sortUsersLowToHigh,
} from "../../config/AuctioneerLogics.jsx";

const UserSellers = () => {
  const [auctioneer, setAuctioneer] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6);
  const { data: seller } = useListAuctioneersUserQuery();
  useEffect(() => {
    if (seller) {
      setSellers(seller);
    }
    if (sellers) setAuctioneer(sellers.slice(startIndex, endIndex));
  }, [seller, startIndex, endIndex]);
  return (
    <Flex pt={10} mx={20} flexDirection={"column"}>
      {/* <Flex alignItems={"center"} justifyContent={"flex-end"}>
        <Accordion allowToggle mr={{ md: 12 }}>
          <AccordionItem>
            <AccordionButton>
              <Text whiteSpace={"nowrap"}>Sort By Rating</Text>
              <AccordionIcon ml={{ md: 10 }} />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <CheckboxGroup>
                <Stack>
                  <RadioGroup
                    onChange={(newValue) => {
                      newValue == -1
                        ? setAuctioneer(sortUsersLowToHigh(sellers))
                        : setAuctioneer(sortUsersHighToLow(sellers));
                    }}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <Radio value={"-1"}>low to high</Radio>
                    <Radio value={"1"}>high to low</Radio>
                  </RadioGroup>
                </Stack>
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex> */}
      <Flex flexWrap={{ md: "wrap" }} justifyContent={{ md: "space-around" }}>
        {auctioneer &&
          auctioneer.map((auctioneer) => (
            <SellerCard key={auctioneer._id} auctioneer={auctioneer} />
          ))}
        <PaginationForFilter
          setEndIndex={setEndIndex}
          setStartIndex={setStartIndex}
          total={sellers?.length}
        />
      </Flex>
    </Flex>
  );
};

export default UserSellers;
