/* eslint-disable no-unused-vars */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import Pagination from "../../components/Admin/Pagination";
import BreadCrumbs from "../../components/Admin/BreadCrumbs";
import { useState, useEffect, useRef } from "react";
import { useListReverseAuctionsAdminQuery } from "../../slices/adminApiSlice";
import moment from "moment";

const AdminListEnglishAuctions = () => {
  const [startIndex, setStartIndex] = useState();
  const [endIndex, setEndIndex] = useState();
  const [auctions, setAuctions] = useState();
  const [totalAuctions, setTotalAuctions] = useState();
  const [auctionDetail, setAuctionDetail] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const toast = useToast();
  const {
    data: allAuctions,
    error,
    refetch,
  } = useListReverseAuctionsAdminQuery();
  useEffect(() => {
    if (allAuctions) {
      setTotalAuctions(allAuctions.length);
      setAuctions(allAuctions.slice(startIndex, endIndex));
    }
  }, [startIndex, endIndex, allAuctions, auctions]);
  return (
    <>
      <Box p={2}>
        <BreadCrumbs
          allPage={[
            { Name: "Admin Panel", Link: "/admin" },
            { Name: "List Reverse Auctions", Link: "/admin/listReverseAuctions" },
          ]}
        />
      </Box>
      {auctions ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Item</Th>
                <Th>Quantity</Th>
                <Th>Seller</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {auctions.map((auction) => (
                <Tr key={auction._id}>
                  <Td>{auction._id}</Td>
                  <Td>{auction.item}</Td>
                  <Td>{auction.quantity}</Td>
                  <Td>{auction.user.name}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<HamburgerIcon />}
                        variant="outline"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<InfoOutlineIcon />}
                          ref={btnRef}
                          onClick={() => {
                            onOpen();
                            setAuctionDetail(auction);
                          }}
                        >
                          Auction Details
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
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
      <Drawer
        size="sm"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Auction Details - {auctionDetail?._id}</DrawerHeader>
          <DrawerBody>
            <VStack alignItems="flex-start" spacing="2">
              <Box>
                <Text as="B">Auction Item:</Text>
                <Text>{auctionDetail?.item}</Text>
              </Box>
              <Box>
                <Text as="B">Item Quantity:</Text>
                <Text>{auctionDetail?.quantity}</Text>
              </Box>
              <Box>
                <Text as="B">Start Date:</Text>
                <Text>
                  {moment(auctionDetail?.startsOn).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </Text>
              </Box>
              <Box>
                <Text as="B">End Date:</Text>
                <Text>
                  {moment(auctionDetail?.endsOn).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </Text>
              </Box>
              <Box>
                <Text as="B">Created On:</Text>
                <Text>
                  {moment(auctionDetail?.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer Id:</Text>
                <Text>{auctionDetail?.user._id}</Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer Name:</Text>
                <Text>{auctionDetail?.user.name}</Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer email:</Text>
                <Text>{auctionDetail?.user.email}</Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminListEnglishAuctions;
