/* eslint-disable react/prop-types */
import { Flex } from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";

const BarGraph = ({ data }) => {
  return (
    <Flex  w={"md"} h={96}>
      <ResponsiveBar
        data={data}
        keys={["quantity"]}
        indexBy="date"
        margin={{ top: 20, right: 50, bottom: 60, left: 50 }}
        padding={0.3}
        colors={{ scheme: "category10" }}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        axisBottom={{
            tickRotation: -45, // Set the rotation angle for date labels
          }}
      />
    </Flex>
  );
};

export default BarGraph;
