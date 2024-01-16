/* eslint-disable react/prop-types */
import { Button, useToast } from "@chakra-ui/react";

function RazorPay({ amount, AuctionId }) {
  const toast = useToast();
  const currency = "INR";
  const paymentHandler = async () => {
    const response = await fetch("/api/users/razorpay", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: AuctionId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    const options = {
      key: "rzp_test_rlrLeNuyQ8mztp",
      amount,
      currency,
      name: "EDEN",
      description: "Test Transaction",
      image:
        "https://imgs.search.brave.com/02es6YYzBO6guiENLPW__cAIc7cOnZykyMUu1YfXB8U/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9keW5h/bWljLmJyYW5kY3Jv/d2QuY29tL2Fzc2V0/L2xvZ28vNmY3OTE4/OGEtMGMxMi00MWQ3/LThlYjYtZWVkYmJj/OGNhYTUzL2xvZ28t/c2VhcmNoLWdyaWQt/MXg_bG9nb1RlbXBs/YXRlVmVyc2lvbj0x/JnY9NjM3NzU4NDY4/NDQzMzcwMDAw",
      order_id: order.id,
      handler: async function (response) {
        const body = {
          ...response,
        };
        const validateRes = await fetch("api/users/razorpayvalidate", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonRes = await validateRes.json();
        return jsonRes;
      },
      prefill: {
        name: "Web Dev Matrix",
        email: "webdevmatrix@example.com",
        contact: "9000000000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    let rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      let errorMessage = "Payment Failure!";
      if (response.error) {
        errorMessage = response.error.description || "Unknown error";
      }
      toast({
        title: "Payment Failure, Please try again!",
        description: `${errorMessage}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    });
    rzp1.open();
  };
  return (
    <Button ml={2} size={"sm"} onClick={paymentHandler}>
      Razorpay
    </Button>
  );
}
export default RazorPay;
