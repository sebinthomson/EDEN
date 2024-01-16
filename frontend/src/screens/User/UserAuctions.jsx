/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
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
  useToast,
  Button,
  RadioGroup,
  Radio,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  Input,
  InputRightAddon,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useFilterAuctionsMutation } from "../../slices/userApiSlice.js";
import EnglishAuctionCard from "../../components/User/EnglishAuctionCard.jsx";
import ReverseAuctionCard from "../../components/User/ReverseAuctionCard.jsx";
import { useState, useEffect } from "react";
import PaginationForFilter from "../../components/User/PaginationForFilter.jsx";
import { Search2Icon } from "@chakra-ui/icons";
import { compareDates } from "../../config/AuctioneerLogics.jsx";

const UserAuctions = () => {
  const [search, setSearch] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [status, setStatus] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6);
  const [english, setEnglish] = useState(true);
  const [total, setTotal] = useState(0);
  const [auction, setAuction] = useState([]);
  const [response, setResponse] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState("-1");
  const [filterFields, setFilterFields] = useState({
    quantity: [0, Infinity],
    quantityLength: 5,
  });
  const [filterAuctionsApiCall] = useFilterAuctionsMutation();
  const toast = useToast();
  const fetchAuctions = async () => {
    try {
      const res = await filterAuctionsApiCall({
        english,
      }).unwrap();
      setResponse(res?.auction);
      setAuction(res?.auction);
      setTotal(res?.auction?.length);
      setFilterFields(res?.filterFields);
      setSliderValue(
        res?.filterFields?.quantity[res?.filterFields?.quantityLength - 1]
      );
    } catch (error) {
      toast({
        title: `${error?.data?.message || error.error}`,
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const filterAuctions = (
    search,
    filter,
    startIndex,
    endIndex,
    sort,
    sliderValue,
    status
  ) => {
    let filteredAuctions = response;
    if (search.length > 0) {
      filteredAuctions = filteredAuctions?.filter((item) =>
        item?.item?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter?.length > 0) {
      filteredAuctions = filteredAuctions.filter((auct) =>
        filter?.includes(auct.item)
      );
    }
    if (sliderValue) {
      filteredAuctions = filteredAuctions.filter((auct) => {
        return auct.quantity <= sliderValue;
      });
    }
    if (status?.length > 0) {
      filteredAuctions = filteredAuctions.filter((auct) =>
        compareDates(auct.startsOn, auct.endsOn, status, auct)
      );
    }
    setTotal(filteredAuctions.length);
    if (sort == "1") {
      setAuction(filteredAuctions.slice(startIndex, endIndex).reverse());
    } else {
      setAuction(filteredAuctions.slice(startIndex, endIndex));
    }
  };
  useEffect(() => {
    fetchAuctions();
  }, [english]);
  useEffect(() => {
    filterAuctions(
      search,
      filter,
      startIndex,
      endIndex,
      sort,
      sliderValue,
      status
    );
  }, [startIndex, endIndex, sort, sliderValue, status, filter]);
  return (
    <>
      <Flex justifyContent={"space-around"} m={5}>
        <Button
          size={"sm"}
          w={"49%"}
          onClick={() => {
            setEnglish(true);
            fetchAuctions();
            setResponse([]);
            setAuction([]);
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
            fetchAuctions();
            setResponse([]);
            setAuction([]);
          }}
          bgColor={!english ? "blue.300" : "blue..50"}
          color={!english ? "white" : "black"}
          _hover={{ color: "black" }}
        >
          Reverse Auction
        </Button>
      </Flex>
      <Flex flexDirection={"row"} ml={10}>
        <Flex maxW={{ md: 48 }} minW={{ md: 48 }} flexDirection={"column"}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton justifyContent={"space-between"}>
                <Text whiteSpace={"nowrap"}>Auction Item</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <CheckboxGroup>
                  <Stack>
                    {filterFields?.items?.map((item) => {
                      return (
                        <Checkbox
                          onChange={() => {
                            let contains = Array.isArray(filter)
                              ? [...filter]
                              : [];
                            const index = contains.indexOf(item);
                            if (index !== -1) {
                              contains.splice(index, 1);
                            } else {
                              contains.push(item);
                            }
                            setFilter(contains);
                            filterAuctions(
                              filter,
                              startIndex,
                              endIndex,
                              sort,
                              sliderValue,
                              status
                            );
                          }}
                          key={item}
                        >
                          {item}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton justifyContent={"space-between"}>
                <Text whiteSpace={"nowrap"}>Item Quantity</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Slider
                  id="slider"
                  defaultValue={800}
                  min={0}
                  max={100}
                  colorScheme="teal"
                  onChange={(v) => {
                    setTimeout(() => {
                      setSliderValue(
                        (v *
                          filterFields?.quantity[
                            filterFields.quantityLength - 1
                          ]) /
                          100
                      );
                    }, 0);
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <SliderMark value={0} mt="1" fontSize="sm">
                    0
                  </SliderMark>
                  <SliderMark value={100} mt="1" ml="-8" fontSize="sm">
                    {filterFields?.quantity[filterFields.quantityLength - 1]}
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <Tooltip
                    hasArrow
                    bg="teal.500"
                    color="white"
                    placement="top"
                    isOpen={showTooltip}
                    label={`${sliderValue} kg`}
                  >
                    <SliderThumb />
                  </Tooltip>
                </Slider>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton justifyContent={"space-between"}>
                <Text whiteSpace={"nowrap"}>Auction Status</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <CheckboxGroup>
                  <Stack>
                    <Checkbox
                      onChange={() => {
                        if (status.includes(1)) {
                          setStatus(status.filter((item) => item !== 1));
                        } else {
                          setStatus([...status, 1]);
                        }
                      }}
                    >
                      Upcoming
                    </Checkbox>
                    <Checkbox
                      onChange={() => {
                        if (status.includes(0)) {
                          setStatus(status.filter((item) => item !== 0));
                        } else {
                          setStatus([...status, 0]);
                        }
                      }}
                    >
                      Live
                    </Checkbox>
                    <Checkbox
                      onChange={() => {
                        if (status.includes(-1)) {
                          setStatus(status.filter((item) => item !== -1));
                        } else {
                          setStatus([...status, -1]);
                        }
                      }}
                    >
                      Expired
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
        <Flex flexDirection={"column"}>
          <Flex justifyContent={"space-between"} mb={2} mx={12}>
            <Flex>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Search2Icon color="gray.600" />}
                />
                <Input
                  w={{ md: "xl" }}
                  type="text"
                  placeholder="Search for auction items..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                />
                <InputRightAddon p={0} border="none">
                  <Button
                    borderLeftRadius={0}
                    borderRightRadius={3.3}
                    onClick={() =>
                      filterAuctions(
                        search,
                        filter,
                        startIndex,
                        endIndex,
                        sort,
                        sliderValue,
                        status
                      )
                    }
                  >
                    search
                  </Button>
                </InputRightAddon>
              </InputGroup>
            </Flex>
            <Flex alignItems={"center"}>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Text whiteSpace={"nowrap"}>Sort By</Text>
                    <AccordionIcon ml={{ md: 32 }} />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <CheckboxGroup>
                      <Stack>
                        <RadioGroup
                          onChange={(newValue) => {
                            setSort(newValue);
                          }}
                          display={"flex"}
                          flexDirection={"column"}
                          value={sort}
                        >
                          <Radio value={"-1"}>Latest Auctions</Radio>
                          <Radio value={"1"}>Oldest Auctions</Radio>
                        </RadioGroup>
                      </Stack>
                    </CheckboxGroup>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Flex>
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
          <Flex justifyContent={"space-evenly"} mt={"-25px"}>
            <PaginationForFilter
              setStartIndex={setStartIndex}
              setEndIndex={setEndIndex}
              total={total}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default UserAuctions;
