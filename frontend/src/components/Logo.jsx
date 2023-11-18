import { Image, Text, Flex } from "@chakra-ui/react";
const Logo = () => {
  return (
    <Flex alignItems="flex-start" direction='column' >
      <Image
        src="../../public/Images/logo.png"
        fit="contain"
        boxSize="55px"
        mb='-20px'
      ></Image>
      <Text letterSpacing="5px" fontWeight="700">
        EDEN
      </Text>
    </Flex>
  );
};

export default Logo;
