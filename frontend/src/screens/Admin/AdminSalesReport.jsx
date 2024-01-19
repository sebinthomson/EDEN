import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import BreadCrumbs from "../../components/Admin/BreadCrumbs";
import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import Pagination from "../../components/Admin/Pagination";
import {
  useAllAuctionsSalesReportQuery,
  useDownloadSalesReportMutation,
} from "../../slices/adminApiSlice";

const today = new Date();
const directLinks = [
  {
    title: "Today",
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  },
  {
    title: "Yesterday",
    startDate: format(subDays(today, 1), "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  },
  {
    title: "Last 7 days",
    startDate: format(subDays(today, 7), "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  },
  {
    title: "Last 30 days",
    startDate: format(subDays(today, 30), "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  },
  {
    title: "This month",
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  },
  {
    title: "Last month",
    startDate: format(startOfMonth(subMonths(today, 1)), "yyyy-MM-dd"),
    endDate: format(endOfMonth(subMonths(today, 1)), "yyyy-MM-dd"),
  },
];

const AdminSalesReport = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [auctions, setAuctions] = useState([]);
  const [totalAuctions, setTotalAuctions] = useState();
  const [english, setEnglish] = useState(true);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));
  const [downloadSalesReportApi] = useDownloadSalesReportMutation();
  const { data: allAuctions } = useAllAuctionsSalesReportQuery();
  const toast = useToast();
  useEffect(() => {
    if (allAuctions) {
      english
        ? (setAuctions(
            allAuctions?.allAuctions?.englishAuctions.slice(
              startIndex,
              endIndex
            )
          ),
          setTotalAuctions(allAuctions.allAuctions.englishAuctions.length))
        : (setAuctions(
            allAuctions?.allAuctions?.reverseAuctions.slice(
              startIndex,
              endIndex
            )
          ),
          setTotalAuctions(allAuctions.allAuctions.reverseAuctions.length));
    }
  }, [allAuctions, english, startIndex, endIndex]);

  const handleDownload = async () => {
    try {
      const res = await downloadSalesReportApi({
        startDate,
        endDate,
        english,
      });
      console.log("Response:", res);
      const url = URL.createObjectURL(res);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${startDate}_${endDate}.xlsx`;
      link.click();
    } catch (err) {
      toast({
        title: `${err.message || "An error occurred"}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={2}>
        <BreadCrumbs
          allPage={[
            { Name: "Admin Panel", Link: "/admin" },
            {
              Name: "Sales Report",
              Link: "/admin/adminSalesReport",
            },
          ]}
        />
      </Box>
      <Flex flexDirection={"column"}>
        <Flex flexDirection={"row"} alignItems={"flex-end"}>
          <Flex flexDirection={"column"}>
            <Flex>
              <Flex flexDirection={"column"} mr={6}>
                <Text fontSize={"sm"}>Start Date</Text>
                <Input
                  max={new Date().toISOString().split("T")[0]}
                  type="date"
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                  value={startDate}
                />
              </Flex>
              <Flex flexDirection={"column"}>
                <Text fontSize={"sm"}>End Date</Text>
                <Input
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                />
              </Flex>
            </Flex>
            <HStack mt={2}>
              {directLinks.map((link) => (
                <Text
                  _hover={{ cursor: "pointer" }}
                  textDecoration={"underline"}
                  color={"blue"}
                  fontSize={"sm"}
                  key={link.title}
                  className="text-tiny underline  text-blue-500 cursor-pointer"
                  onClick={() => {
                    setStartDate(link.startDate);
                    setEndDate(link.endDate);
                  }}
                >
                  {link?.title}
                </Text>
              ))}
            </HStack>
          </Flex>
          <Flex ml={{ md: 96, base: 10 }}>
            <Button onClick={handleDownload}>
              <DownloadIcon />
            </Button>
          </Flex>
        </Flex>
        <Flex justifyContent={"space-around"} mt={5}>
          <Button
            size={"sm"}
            w={"49%"}
            onClick={() => {
              setEnglish(true);
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
            }}
            bgColor={!english ? "blue.300" : "blue..50"}
            color={!english ? "white" : "black"}
            _hover={{ color: "black" }}
          >
            Reverse Auction
          </Button>
        </Flex>
        {auctions ? (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Seller</Th>
                  <Th>Item</Th>
                  <Th>Quantity</Th>
                  {english && <Th>Starting Bid</Th>}
                  <Th>Winning Bid</Th>
                </Tr>
              </Thead>
              <Tbody>
                {auctions.map((auction) => (
                  <Tr key={auction._id}>
                    <Td>{auction.user.name}</Td>
                    <Td>{auction.item}</Td>
                    <Td>{auction.quantity}</Td>
                    {english && (
                      <Td>₹{auction?.startingBid?.toLocaleString("en-US")}</Td>
                    )}
                    <Td>₹{auction.winningBid.toLocaleString("en-US")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              setStartIndex={setStartIndex}
              setEndIndex={setEndIndex}
              total={totalAuctions}
            />
          </TableContainer>
        ) : (
          <Box pt="50px" display="flex" justifyContent="space-around">
            <Image src="/Images/Loading.gif" alt="Loader" boxSize="200px" />
          </Box>
        )}
      </Flex>
    </>
  );
};

export default AdminSalesReport;
