/* eslint-disable react/prop-types */
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../slices/adminAuthSlice";

const BreadCrumbs = ({ allPage }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigation = (link) => {
    navigate(link);
  };
  const handleLogout = async () => {
    try {
      dispatch(adminLogout())
      navigate('/admin/adminLogin')
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
    <Box
      display={{ base: "flex", md: "flex" }}
      alignItems={{ base: "center", md: "center" }}
      justifyContent={{ base: "space-between", md: "space-between" }}
    >
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        {allPage.slice(0, -1).map((page, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink onClick={() => handleNavigation(page.Link)}>
              {page.Name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{allPage[allPage.length - 1].Name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Button
        size="sm"
        bgColor="blue.200"
        _hover={{ backgroundColor: "red.400" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default BreadCrumbs;
