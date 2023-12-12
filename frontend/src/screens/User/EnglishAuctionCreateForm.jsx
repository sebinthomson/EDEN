import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNewEnglishAuctionUserMutation } from "../../slices/userApiSlice.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const EnglishAuctionCreateForm = () => {
  const [item, setItem] = useState();
  const [quantity, setQuantity] = useState();
  const [startingBid, setStartingBid] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const [newEnglishAuctionApiCall] = useNewEnglishAuctionUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files).filter(
      (file) => file.type === "image/png" || file.type === "image/jpeg"
    );
    setImages([...images, ...newImages]);
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const handlePublish = async () => {
    if (
      item &&
      quantity &&
      startingBid &&
      startDate &&
      endDate &&
      images.length > 0
    ) {
      try {
        const formData = new FormData();
        formData.append("user", userInfo._id);
        formData.append("item", item);
        formData.append("quantity", quantity);
        formData.append("startingBid", startingBid);
        formData.append("startsOn", startDate);
        formData.append("endsOn", endDate);
        for (let obj of images) {
          formData.append("images", obj);
        }
        const res = await newEnglishAuctionApiCall(formData).unwrap();
        navigate("/userEnglishAuctions/details", {
          state: { data: res.newEnglishAuction },
        });
      } catch (err) {
        toast({
          title: `${err?.data?.message || err.error}`,
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} flexDirection={{ md: "row", base: "column" }}>
        <Box
          p={{ md: "10", base: "10" }}
          pb={{ base: "0" }}
          width={{ md: "4xl" }}
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
            <FormLabel fontWeight={"700"}>Starting Bid</FormLabel>
            <Input
              type="number"
              bgColor={"#8080802e"}
              onChange={(e) => setStartingBid(e.target.value)}
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
        <Box
          p={{ md: "10", base: "10" }}
          pt={{ base: "0" }}
          ml={"0"}
          width={{ md: "md" }}
        >
          <FormLabel fontWeight={"700"}>Images</FormLabel>
          <Input
            type="file"
            display={"flex"}
            border={"none"}
            ml={{ md: "-4" }}
            onChange={handleImageChange}
            multiple
            accept=".png, .jpeg, .jpg"
          />
          <Flex
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {images.length > 0 && (
              <FormLabel fontWeight={"700"} flexDirection={"row"}>
                Preview
                {images.length > 1 &&
                  `  (${currentImageIndex + 1}/${images.length})`}
              </FormLabel>
            )}
            {images.length > 1 && <FiArrowRight onClick={handleNextImage} />}
          </Flex>
          {images.length > 0 && (
            <>
              {images[currentImageIndex] && (
                <Image
                  borderRadius={"lg"}
                  src={URL.createObjectURL(images[currentImageIndex])}
                  width={{ md: "96", base: "md" }}
                  height={{ md: "48", base: "48" }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <Button
        ml={"10"}
        mb={"10"}
        width={"40"}
        bg={"#8080802e"}
        _hover={{ backgroundColor: "grey", color: "white" }}
        onClick={handlePublish}
      >
        Publish Auction
      </Button>
    </Box>
  );
};

export default EnglishAuctionCreateForm;
