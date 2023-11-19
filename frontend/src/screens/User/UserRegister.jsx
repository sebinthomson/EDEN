import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useDisclosure,
  useMergeRefs,
  useToast,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Logo from "../../components/Logo";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  useRegisterUserMutation,
  useSendVerifyMailMutation,
  useOAuthLoginUserMutation,
} from "../../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/userAuthSlice";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otpPage, setOtpPage] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const mergeRef = useMergeRefs(inputRef);
  const toast = useToast();
  const [sendVerifyMailApi, { isLoadingVerificationMail }] =
    useSendVerifyMailMutation();
  const [registerUserApi, { isLoadingRegisterUser }] =
    useRegisterUserMutation();
  const [oAuthLoginUserApi, { isLoadingOAuthLoginUserApi }] =
    useOAuthLoginUserMutation();
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    } else {
      const res = await sendVerifyMailApi({ name, email }).unwrap();
      if (res.otpSend) {
        setOtpPage(true);
      } else {
        toast({
          title: "Failed to send OTP, please try again",
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleVerify = async () => {
    if (otp1 && otp2 && otp3 && otp4) {
      const otpPin = otp1 + otp2 + otp3 + otp4;
      const res = await registerUserApi({
        name,
        email,
        password,
        otpPin,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    }
  };
  const handleOAuth = async (credentials) => {
    try {
      const res = await oAuthLoginUserApi({
        name: credentials.given_name + credentials.family_name,
        email: credentials.email,
        oAuthLogin: true,
      });
      if (res.data.user) {
        dispatch(setCredentials({ ...res.data }));
        navigate("/");
      }
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
    <Container
      maxW="lg"
      pt={{
        base: "5",
        md: "10",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="4">
        <Stack spacing="3" alignItems="center">
          <Logo />
          <Stack
            spacing={{
              base: "",
              md: "",
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              {otpPage ? "Complete your signup" : "Create your new account"}
            </Heading>
            {otpPage ? (
              ""
            ) : (
              <Text color="fg.muted">
                Already have an account?{" "}
                <Link
                  textColor="blue"
                  fontWeight="500"
                  _hover={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    color: "darkblue",
                  }}
                  onClick={() => navigate("/userLogin")}
                >
                  Sign in
                </Link>
              </Text>
            )}
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          {otpPage ? (
            <Stack spacing="6">
              <Stack spacing="5">
                <Text>OTP send to {email}</Text>
                <HStack justifyContent="center">
                  <PinInput>
                    <PinInputField onChange={(e) => setOtp1(e.target.value)} />
                    <PinInputField onChange={(e) => setOtp2(e.target.value)} />
                    <PinInputField onChange={(e) => setOtp3(e.target.value)} />
                    <PinInputField onChange={(e) => setOtp4(e.target.value)} />
                  </PinInput>
                </HStack>
              </Stack>
              <Stack spacing="6">
                <Button onClick={handleVerify}>Verify OTP</Button>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing="3">
              <Stack spacing="2">
                <FormControl>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    type="string"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="text"
                        aria-label={
                          isOpen ? "Mask password" : "Reveal password"
                        }
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onClickReveal}
                      />
                    </InputRightElement>
                    <Input
                      id="password"
                      ref={mergeRef}
                      name="password"
                      type={isOpen ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              <Stack spacing="2">
                <Button onClick={handleSignUp}>Sign up</Button>
                <HStack>
                  <Divider />
                  <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                    or
                  </Text>
                  <Divider />
                </HStack>
                <Flex justifyContent={"space-around"}>
                  <GoogleOAuthProvider clientId="125796492188-9o7hh2f1pin40qa2v4bltacu3kgo204g.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const decoded = jwtDecode(
                          credentialResponse.credential
                        );
                        handleOAuth(decoded);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </Flex>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default UserRegister;
