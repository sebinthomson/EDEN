/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  IconButton,
  Text,
  Tooltip,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const PaginationForFilter = ({ setStartIndex, setEndIndex, total }) => {
  const [pageSize, setPageSize] = useState(6);
  const [start, setStart] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setStartIndex(start);
    setEndIndex(Math.min(start + pageSize, total));
    setTotalPages(Math.ceil(total / pageSize));
  }, [start, pageSize, total, currentPage]);
  const gotoPage = (page) => {
    const newStart = Math.max(page - 1, 0) * pageSize;
    setCurrentPage(page);
    setStart(newStart);
  };
  return (
    <Flex justifyContent="space-between" m={4} alignItems="center">
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            onClick={() => gotoPage(1)}
            isDisabled={currentPage == 1}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
          />
        </Tooltip>
        <Tooltip label="Previous Page">
          <IconButton
            onClick={() => gotoPage(currentPage - 1)}
            isDisabled={currentPage == 1}
            icon={<ChevronLeftIcon h={6} w={6} />}
          />
        </Tooltip>
      </Flex>

      <Flex alignItems="center">
        <Text flexShrink="0" mr={8}>
          Page{" "}
          <Text fontWeight="bold" as="span">
            {currentPage}
          </Text>{" "}
          of{" "}
          <Text fontWeight="bold" as="span">
            {totalPages}
          </Text>
        </Text>
        <Text flexShrink="0">Go to page:</Text>{" "}
        <NumberInput
          ml={2}
          mr={8}
          w={28}
          min={1}
          max={totalPages}
          onChange={(value) => {
            const page = value || 0;
            gotoPage(Number(page));
          }}
          defaultValue={currentPage}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            onClick={() => gotoPage(currentPage + 1)}
            isDisabled={currentPage == totalPages}
            icon={<ChevronRightIcon h={6} w={6} />}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            onClick={() => gotoPage(totalPages)}
            isDisabled={currentPage == totalPages}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default PaginationForFilter;
