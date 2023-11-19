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
import { useState, useEffect, useRef } from "react";
import {
  useListUsersMutation,
  useBlockUnblockUserMutation,
} from "../../slices/adminApiSlice";

const AdminListUsers = () => {
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [listUsersApiCall] = useListUsersMutation();
  const [blockUnblockUserApiCall] = useBlockUnblockUserMutation();
  const toast = useToast();
  const fetchData = async () => {
    try {
      const res = await listUsersApiCall().unwrap();
      setUsers(res.users);
    } catch (error) {
      toast({
        title: "Error while fetching data",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const userAction = async ({ block, userId }) => {
    try {
      const res = await blockUnblockUserApiCall({ userId, block }).unwrap();
      toast({
        title: `${res.message}`,
        status: res.task ? "success" : "error",
        duration: 9000,
        isClosable: true,
      });
      fetchData();
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
      {users ? (
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
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{user._id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.isBlocked ? "Blocked" : "Active"}</Td>
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
                        {user.isBlocked ? (
                          <MenuItem
                            icon={<NotAllowedIcon />}
                            onClick={() =>
                              userAction({ block: false, userId: user._id })
                            }
                          >
                            UnBlock {user.name}
                          </MenuItem>
                        ) : (
                          <MenuItem
                            icon={<NotAllowedIcon />}
                            onClick={() =>
                              userAction({ block: true, userId: user._id })
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
        </TableContainer>
      ) : (
        <Box pt="50px" display="flex" justifyContent="space-around">
          <Image
            src="../public/Images/Loading.gif"
            alt="Loader"
            boxSize="200px"
          />
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
          <DrawerHeader>User Details - {userDetail?.name}</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" spacing="2">
              <Box>
                <Text as="B">User Id:</Text>
                <Text>{userDetail?._id}</Text>
              </Box>
              <Box>
                <Text as="B">User Name:</Text>
                <Text>{userDetail?.name}</Text>
              </Box>
              <Box>
                <Text as="B">User Email:</Text>
                <Text>{userDetail?.email}</Text>
              </Box>
              <Box>
                <Text as="B">Status:</Text>
                <Text>{userDetail?.isBlocked ? "Blocked" : "Active"}</Text>
              </Box>
              <Box>
                <Text as="B">Auctioneer:</Text>
                <Text>{userDetail?.auctioneer ? "Yes" : "No"}</Text>
              </Box>
              <Box>
                <Text as="B">Joined On:</Text>
                <Text>{Date(userDetail?.createdAt).toLocaleString()}</Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminListUsers;
