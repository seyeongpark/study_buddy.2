import React from "react";
import { Box, Flex } from "@chakra-ui/react";

export default function ColorPicker({ onChange, customColors = [] }) {
  return (
    <Flex gap={2} mt={2}>
      {customColors.map((color) => (
        <Box
          key={color}
          w="25px"
          h="25px"
          borderRadius="50%"
          bg={color}
          border="1px solid #000"
          cursor="pointer"
          onClick={() => onChange(color)}
        />
      ))}
    </Flex>
  );
}
