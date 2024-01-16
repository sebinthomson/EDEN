import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNewReverseAuctionUserMutation } from "../../slices/userApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReverseAuctionCreateForm = () => {
  const [item, setItem] = useState();
  const [quantity, setQuantity] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const [newReverseAuctionApiCall] = useNewReverseAuctionUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const handlePublish = async () => {
    if (!item || !quantity || !startDate || !endDate) {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    } else {
      try {
        const res = await newReverseAuctionApiCall({
          userId: userInfo._id,
          item,
          quantity,
          startDate,
          endDate,
        }).unwrap();
        navigate("/userReverseAuctions/details", {
          state: { data: res.newReverseAuction },
        });
      } catch (err) {
        console.log(err);
        toast({
          title: `${err?.data?.message || err.error}`,
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Box
      display={"flex"}
      flexDirection={{ md: "row", base: "column" }}
      justifyContent={{ md: "space-between" }}
    >
      <Box display={"flex"} flexDirection={{ md: "row", base: "column" }}>
        <Box
          p={{ md: "10", base: "10" }}
          pb={{ base: "0" }}
          width={{ md: "5xl" }}
        >
          <FormControl>
            <FormLabel fontWeight={"700"}>Item</FormLabel>
            <Input
              type="String"
              bgColor={"#8080802e"}
              onChange={(e) => setItem(e.target.value)}
            />
            <FormLabel fontWeight={"700"}>Quantity</FormLabel>
            <Input
              type="number"
              bgColor={"#8080802e"}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <FormControl
              display={"flex"}
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={{ md: "space-between" }}
            >
              <Box width={{ md: "47%" }}>
                <FormLabel fontWeight={"700"}>Bidding Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  bgColor={"#8080802e"}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Box>
              <Box width={{ md: "47%" }}>
                <FormLabel fontWeight={"700"}>Bidding End Date</FormLabel>
                <Input
                  type="datetime-local"
                  bgColor={"#8080802e"}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
            </FormControl>
          </FormControl>
        </Box>
      </Box>
      <Box
        p={{ md: "10", base: "10" }}
        pb={{ base: "10" }}
        display={"flex"}
        alignItems={{ md: "flex-end" }}
      >
        <Button
          bg={"#8080802e"}
          _hover={{ backgroundColor: "grey", color: "white" }}
          onClick={handlePublish}
        >
          Publish Auction
        </Button>
      </Box>
    </Box>
  );
};

export default ReverseAuctionCreateForm;
