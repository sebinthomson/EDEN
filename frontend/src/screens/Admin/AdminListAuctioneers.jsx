/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  HamburgerIcon,
  InfoOutlineIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import BreadCrumbs from "../../components/Admin/BreadCrumbs";
import { useState, useRef, useEffect } from "react";
import {
  useListAuctioneersQuery,
  useBlockUnblockUserMutation,
} from "../../slices/adminApiSlice";
import Pagination from "../../components/Admin/Pagination";
import moment from "moment";

const AdminListAuctioneers = () => {
  const [totalUsers, setTotalUsers] = useState();
  const [userDetail, setUserDetail] = useState();
  const [startIndex, setStartIndex] = useState();
  const [usersDetails, setUsersDetails] = useState();
  const [endIndex, setEndIndex] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { data: users, error, refetch } = useListAuctioneersQuery();
  useEffect(() => {
    if (users) {
      setTotalUsers(users.length);
      setUsersDetails(users.slice(startIndex, endIndex));
    }
  }, [startIndex, endIndex, users, setUsersDetails]);
  const [blockUnblockUserApiCall] = useBlockUnblockUserMutation();
  const toast = useToast();
  const userAction = async ({ block, userId }) => {
    try {
      const res = await blockUnblockUserApiCall({ userId, block }).unwrap();
      toast({
        title: `${res.message}`,
        status: res.task ? "success" : "error",
        duration: 9000,
        isClosable: true,
      });
      refetch();
    } catch (err) {
      toast({
        title: `${err?.data?.message || err.error}`,
        status: `error`,
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
            { Name: "List Users", Link: "/admin/listUsers" },
          ]}
        />
      </Box>
      {usersDetails ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersDetails.map((user) => (
                <Tr key={user._id}>
                  <Td>{user._id}</Td>
                  <Td>{user?.user.name}</Td>
                  <Td>{user.user.isBlocked ? "Blocked" : "Active"}</Td>
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
                            setUserDetail(user);
                          }}
                        >
                          User Details
                        </MenuItem>
                        {user.user.isBlocked ? (
                          <MenuItem
                            icon={<NotAllowedIcon />}
                            onClick={() =>
                              userAction({ block: false, userId: user.user._id })
                            }
                          >
                            UnBlock {user.name}
                          </MenuItem>
                        ) : (
                          <MenuItem
                            icon={<NotAllowedIcon />}
                            onClick={() =>
                              userAction({ block: true, userId: user.user._id })
                            }
                          >
                            Block {user.name}
                          </MenuItem>
                        )}
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
            total={totalUsers}
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
          <DrawerHeader>Auctioneer Details - {userDetail?._id}</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" spacing="2">
              <Box>
                <Text as="B">User Id:</Text>
                <Text>{userDetail?.user._id}</Text>
              </Box>
              <Box>
                <Text as="B">User Name:</Text>
                <Text>{userDetail?.user.name}</Text>
              </Box>
              <Box>
                <Text as="B">User Email:</Text>
                <Text>{userDetail?.user.email}</Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer Mobile Number:</Text>
                <Text>{userDetail?.mobileNumber}</Text>
              </Box>
              <Box>
                <Text as="B">Location:</Text>
                <Text>{userDetail?.location}</Text>
              </Box>
              <Box>
                <Text as="B">Status:</Text>
                <Text>{userDetail?.isBlocked ? "Blocked" : "Active"}</Text>
              </Box>
              <Box>
                <Text as="B">Joined On:</Text>
                <Text>
                  {moment(userDetail?.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminListAuctioneers;
