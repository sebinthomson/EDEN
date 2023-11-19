import { Flex } from "@chakra-ui/react";
import AuctionCard from "../../components/User/AuctionCard";

const UserHome = () => {
  
  return (
    <Flex flexDirection={{md:"row", base:"column"}} px={{md:'10'}} p={{md:'5'}} justifyContent={"space-around"}>
      <AuctionCard />
      <AuctionCard />
      <AuctionCard />
      <AuctionCard />
    </Flex>
  );
};

export default UserHome;
