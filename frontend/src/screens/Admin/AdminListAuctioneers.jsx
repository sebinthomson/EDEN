/* eslint-disable react/no-children-prop */
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
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  Button,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  InfoOutlineIcon,
  NotAllowedIcon,
  RepeatIcon,
  Search2Icon,
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
  const [response, setResponse] = useState([]);
  const [search, setSearch] = useState("");
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
      setResponse(users);
    }
    if (search.length > 0) handleSearch();
  }, [startIndex, endIndex, users, search]);
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
  const handleSearch = () => {
    let searchedUsers = [];
    if (search.length > 0) {
      searchedUsers = response?.filter((item) => {
        return item?.user?.name?.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      searchedUsers = response;
    }
    setTotalUsers(searchedUsers.length);
    setUsersDetails(searchedUsers.slice(startIndex, endIndex));
  };
  return (
    <>
      <Box p={2}>
        <BreadCrumbs
          allPage={[
            { Name: "Admin Panel", Link: "/admin" },
            { Name: "List Auctioneers", Link: "/admin/listAuctioneers" },
          ]}
        />
      </Box>
      <Flex>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.600" />}
          />
          <Input
            w={{ md: "xl", base: "lg" }}
            type="text"
            placeholder="Search for auctioneers"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
          <InputRightAddon p={0} border="none">
            <Button
              borderLeftRadius={0}
              borderRightRadius={3.3}
              onClick={() => {
                handleSearch();
              }}
            >
              search
            </Button>
            <Button
              borderLeftRadius={0}
              borderRightRadius={3.3}
              onClick={() => {
                setSearch("");
              }}
            >
              <RepeatIcon />
            </Button>
          </InputRightAddon>
        </InputGroup>
      </Flex>
      {usersDetails ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Contact</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersDetails.map((user) => (
                <Tr key={user._id}>
                  <Td>{user?.user.name}</Td>
                  <Td>{user.user.email}</Td>
                  <Td>{user.mobileNumber}</Td>
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
                          Auctioneer Details
                        </MenuItem>
                        {user.user.isBlocked ? (
                          <MenuItem
                            icon={<NotAllowedIcon />}
                            onClick={() =>
                              userAction({
                                block: false,
                                userId: user.user._id,
                              })
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
          <DrawerHeader>Auctioneer Detail</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" spacing="2">
              <Box>
                <Text as="B">Auctioneer Name:</Text>
                <Text>{userDetail?.user.name}</Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer Email:</Text>
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
