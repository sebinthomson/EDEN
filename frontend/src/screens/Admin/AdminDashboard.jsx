/* eslint-disable no-unused-vars */
import { Box, Flex, Icon, Image, Stack, Text } from "@chakra-ui/react";
import BreadCrumbs from "../../components/Admin/BreadCrumbs";
import PieChart from "../../components/Admin/PieChart";
import { useAdminDashboardQuery } from "../../slices/adminApiSlice";
import { FaSackDollar, FaUsersBetweenLines } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import BarGraph from "../../components/Admin/BarGraph";

const AdminDashboard = () => {
  const { data: dashboard, error, refetch } = useAdminDashboardQuery();
  console.log(dashboard);
  return (
    <>
      <Box p={2}>
        <BreadCrumbs
          allPage={[
            { Name: "Admin Panel", Link: "/admin" },
            { Name: "Dashboard", Link: "/admin/" },
          ]}
        />
        {dashboard ? (
          <Flex flexDirection={"column"} mt={10}>
            <Stack
              mb={5}
              flexDirection={"row"}
              justifyContent={"space-between"}
              wrap={"wrap"}
            >
              <Box
                p={2}
                bgColor={"blue.100"}
                minW={40}
                minH={20}
                maxW={40}
                maxH={20}
                borderRadius={5}
              >
                {dashboard?.profit && (
                  <Text fontWeight={750} fontSize={"large"} color={"gray.800"}>
                    {"Rs."}
                    {dashboard?.profit}
                    {"/-"}
                  </Text>
                )}
                <Stack
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  pr={2}
                  alignItems={"flex-end"}
                >
                  <Text fontWeight={600} color={"gray.800"}>
                    Profit
                  </Text>
                  <Icon as={FaSackDollar} boxSize={8}></Icon>
                </Stack>
              </Box>
              <Box
                p={2}
                bgColor={"green.100"}
                minW={40}
                minH={20}
                maxW={40}
                maxH={20}
                borderRadius={5}
              >
                {dashboard?.users && (
                  <Text fontWeight={750} fontSize={"large"} color={"gray.800"}>
                    {dashboard?.users}
                  </Text>
                )}
                <Stack
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  pr={2}
                  alignItems={"flex-end"}
                >
                  <Text fontWeight={600} color={"gray.800"}>
                    Users
                  </Text>
                  <Icon as={FaUsers} boxSize={8}></Icon>
                </Stack>
              </Box>
              <Box
                p={2}
                bgColor={"blue.100"}
                minW={40}
                minH={20}
                maxW={40}
                maxH={20}
                borderRadius={5}
              >
                {dashboard?.auctioneers && (
                  <Text fontWeight={750} fontSize={"large"} color={"gray.800"}>
                    {dashboard?.auctioneers}
                  </Text>
                )}
                <Stack
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  pr={2}
                  alignItems={"flex-end"}
                >
                  <Text fontWeight={600} color={"gray.800"}>
                    Auctioneers
                  </Text>
                  <Icon as={FaUsersBetweenLines} boxSize={8}></Icon>
                </Stack>
              </Box>
              <Box
                p={2}
                bgColor={"green.100"}
                minW={40}
                minH={20}
                maxW={40}
                maxH={20}
                borderRadius={5}
              >
                {dashboard?.RA && (
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text
                      fontWeight={750}
                      fontSize={"large"}
                      color={"gray.800"}
                    >
                      {dashboard?.RA}
                    </Text>
                    <Text ml={1} fontWeight={400} fontSize={12}>
                      (Completed/Total)
                    </Text>
                  </Flex>
                )}
                <Stack
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  pr={2}
                  alignItems={"flex-end"}
                >
                  <Text fontWeight={600} color={"gray.800"} lineHeight={1}>
                    Reverse Auctions
                  </Text>
                  <Icon as={FiActivity} boxSize={8}></Icon>
                </Stack>
              </Box>
              <Box
                p={2}
                bgColor={"blue.100"}
                minW={40}
                minH={20}
                maxW={40}
                maxH={20}
                borderRadius={5}
              >
                {dashboard?.EA && (
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text
                      fontWeight={750}
                      fontSize={"large"}
                      color={"gray.800"}
                    >
                      {dashboard?.EA}
                    </Text>
                    <Text ml={1} fontWeight={400} fontSize={12}>
                      (Completed/Total)
                    </Text>
                  </Flex>
                )}
                <Stack
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  pr={2}
                  alignItems={"flex-end"}
                >
                  <Text fontWeight={600} color={"gray.800"} lineHeight={1}>
                    English Auctions
                  </Text>
                  <Icon as={FiActivity} boxSize={8}></Icon>
                </Stack>
              </Box>
            </Stack>
            <Text fontSize={40} fontWeight={600}>
              English Auction Analytics
            </Text>
            <Flex
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={"space-between"}
              mb={-14}
            >
              <Flex flexDirection={"column"}>
                <Text> Quantity vs Auction End Dates</Text>
                {dashboard?.englishAuctionTotalQuantity && (
                  <BarGraph data={dashboard?.englishAuctionTotalQuantity} />
                )}
              </Flex>
              <Flex flexDirection={"column"}>
                <Text> English Auctioned Items</Text>
                {dashboard?.englishAuctionItemQuantities && (
                  <PieChart data={dashboard?.englishAuctionItemQuantities} />
                )}
              </Flex>
            </Flex>
            <Text fontSize={40} fontWeight={600}>
              Reverse Auction Analytics
            </Text>
            <Flex flexDirection={{ md: "row", base: "column" }}justifyContent={"space-between"}>
              <Flex flexDirection={"column"}>
                <Text> Reverse Auctioned Items</Text>
                {dashboard?.reverseAuctionItemQuantities && (
                  <PieChart data={dashboard?.reverseAuctionItemQuantities} />
                )}
              </Flex>
              <Flex flexDirection={"column"}>
                <Text> Quantity vs Auction End Dates</Text>
                {dashboard?.reverseAuctionTotalQuantity && (
                  <BarGraph data={dashboard?.reverseAuctionTotalQuantity} />
                )}
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Box pt="50px" display="flex" justifyContent="space-around">
            <Image src="/Images/Loading.gif" alt="Loader" boxSize="200px" />
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdminDashboard;
