import {
  Box,
  Button,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import BreadCrumbs from "../../components/Admin/BreadCrumbs.jsx";
import Pagination from "../../components/Admin/Pagination.jsx";
import { useEffect, useState } from "react";
import {
  useApproveAuctionsQuery,
  useApproveAuctionMutation,
} from "../../slices/adminApiSlice.js";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

const AdminApproveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [auctionDetails, setAucitonDetails] = useState();
  const [startIndex, setStartIndex] = useState();
  const [endIndex, setEndIndex] = useState();
  const [totalAuctions, setTotalAuctions] = useState(0);
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const [approveAuctionApi] = useApproveAuctionMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: pendingAuctions, refetch } = useApproveAuctionsQuery();

  useEffect(() => {
    setTotalAuctions(pendingAuctions?.length);
    setAuctions(pendingAuctions?.slice(startIndex, endIndex));
  }, [pendingAuctions, startIndex, endIndex]);
  const handleView = async (auctionId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminInfo?.admin?.token}`,
        },
      };
      const { data } = await axios.get(`/api/bids/${auctionId}`, config);
      setAucitonDetails(data);
      onOpen();
    } catch (error) {
      toast({
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleApprove = async (
    auctionId,
    winningBid,
    email,
    auctionType,
    auction
  ) => {
    try {
      const res = await approveAuctionApi({
        auctionId: auctionId,
        winningBid: winningBid,
        email: email,
        auctionType: auctionType,
        auction: auction,
      }).unwrap();
      if (res.updation) onClose();
      refetch();
    } catch (error) {
      toast({
        description: "Failed to approve the auction",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
              Name: "Approve Auctions",
              Link: "/admin/approveAuctions",
            },
          ]}
        />
      </Box>
      {auctions ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Auctioneer</Th>
                <Th>Item</Th>
                <Th>Quantity</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {auctions.map((auction) => (
                <Tr key={auction._id}>
                  <Td>{auction.auctionId.user.name}</Td>
                  <Td>{auction.auctionId.item}</Td>
                  <Td>{auction.auctionId.quantity}</Td>
                  <Td>{auction.auctionType}</Td>
                  <Td>
                    <Button
                      size={"sm"}
                      onClick={() => handleView(auction.auctionId._id)}
                    >
                      Approve
                    </Button>
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
      {auctionDetails && (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Review and approve auction :{auctionDetails.auction._id}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <>
                  <Text fontWeight={"bold"}>Auction Details</Text>
                  <Flex>
                    <Flex mr={10}>
                      <Text fontWeight={500}>{"Auctioneer :"} </Text>
                      <Text> {auctionDetails.auction.user.name}</Text>
                    </Flex>
                    <Flex>
                      <Text fontWeight={500}>{"Quantity :"} </Text>
                      <Text> {auctionDetails.auction.quantity}</Text>
                    </Flex>
                  </Flex>
                  <Flex>
                    <Flex mr={10}>
                      <Text fontWeight={500}>{"Item :"} </Text>
                      <Text> {auctionDetails.auction.item}</Text>
                    </Flex>
                    {auctionDetails.auction.startingBid && (
                      <Flex>
                        <Text fontWeight={500}>{"StartingBid :"} </Text>
                        <Text> {auctionDetails.auction.startingBid}</Text>
                      </Flex>
                    )}
                  </Flex>
                  <Flex>
                    <Text fontWeight={500}>{"Start Date :"} </Text>
                    <Text>
                      {moment(auctionDetails.auction.startsOn).format(
                        " Do MMMM YYYY, h:mm:ss a"
                      )}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight={500}>{"End Date : "}</Text>
                    <Text>
                      {" "}
                      {moment(auctionDetails.auction.endsOn).format(
                        " Do MMMM YYYY, h:mm:ss a"
                      )}
                    </Text>
                  </Flex>
                  <br></br>
                  <Text fontWeight={"bold"}>Bidding History</Text>
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Amount</Th>
                          <Th>User</Th>
                          <Th>Time</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {auctionDetails.bidsHistory.map((bids) => (
                          <Tr key={bids._id}>
                            <Td>
                              {"Rs. "}
                              {bids.content}
                            </Td>
                            <Tooltip label={bids.sender.email}>
                              <Td>{bids.sender.name}</Td>
                            </Tooltip>
                            <Td>
                              {moment(bids.updatedAt).format(
                                " Do MMMM YYYY, h:mm:ss a"
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </>
              </ModalBody>
              <ModalFooter>
                <Button size={"sm"} mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  size={"sm"}
                  colorScheme="blue"
                  onClick={() =>
                    handleApprove(
                      auctionDetails.auction._id,
                      auctionDetails.bidsHistory[
                        auctionDetails.bidsHistory.length - 1
                      ].content,
                      auctionDetails.bidsHistory[
                        auctionDetails.bidsHistory.length - 1
                      ].sender.email,
                      auctionDetails.bidsHistory[0].biddings.auctionType,
                      auctionDetails.auction
                    )
                  }
                >
                  Approve Auction
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default AdminApproveAuctions;
