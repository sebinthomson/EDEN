/* eslint-disable react/prop-types */
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
  Heading,
  HStack,
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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/userAuthSlice";
import {
  useConfirmForgotPasswordOTPMutation,
  useChangePasswordUserMutation,
} from "../../slices/userApiSlice";

const UserForgotAndConfirmPassword = ({ email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otpPage, setOtpPage] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmForgotPasswordOTPApi] = useConfirmForgotPasswordOTPMutation();
  const [changePasswordApi] = useChangePasswordUserMutation();
  const { isOpen, onToggle } = useDisclosure();
  const mergeRef = useMergeRefs(inputRef);
  const toast = useToast();
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  const handlePasswordChange = async () => {
    if (
      !password.trim() ||
      !confirmPassword.trim() ||
      !(password === confirmPassword)
    ) {
      toast({
        title: "Passwords doesn't match",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    } else {
      try {
        const res = await changePasswordApi({ email, password }).unwrap();
        dispatch(setCredentials({ ...res.user }));
        navigate("/");
      } catch (err) {
        toast({
          title: `${err?.data?.message || err.error}`,
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleVerify = async () => {
    try {
      const otpPin = otp1 + otp2 + otp3 + otp4;
      const res = await confirmForgotPasswordOTPApi({ otpPin }).unwrap();
      toast({
        title: `${res.message}`,
        status: `success`,
        duration: 9000,
        isClosable: true,
      });
      setOtpPage(false);
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
              {otpPage
                ? "Complete your email verification"
                : "Update your password"}
            </Heading>
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
                <Button
                  isDisabled={!otp1 || !otp2 || !otp3 || !otp4}
                  onClick={handleVerify}
                >
                  Verify OTP
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing="3">
              <Stack spacing="2">
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
                <FormControl>
                  <FormLabel htmlFor="password">Confirm Password</FormLabel>
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              <Stack spacing="2">
                <Button onClick={handlePasswordChange}>Change Password</Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default UserForgotAndConfirmPassword;
