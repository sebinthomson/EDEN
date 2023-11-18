/* eslint-disable react/prop-types */
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ allPage }) => {
  const navigate = useNavigate();
  const handleNavigation = (link) => {
    navigate(link);
  };
  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
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
  );
};

export default BreadCrumbs;
