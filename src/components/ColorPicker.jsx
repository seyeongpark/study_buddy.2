import React from 'react';
import { Box, Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush } from '@fortawesome/free-solid-svg-icons';

const ColorPicker = ({ onChange }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button 
          size='sm' 
          backgroundColor='transparent'
          _hover='none'>
          <FontAwesomeIcon icon={faBrush} />
        </Button>
      </PopoverTrigger>
      <PopoverContent p={4}>
        <PopoverArrow />
        <PopoverCloseButton />
        <Text mb={2}>Select a background color:</Text>
        <Box>
          <Button
            onClick={() => onChange('white')}
            borderRadius="50%"
            width="30px"
            height="30px"
            backgroundColor="white"
            border="1px solid #000"
            mr={2}
          />
          <Button
            onClick={() => onChange('lightgreen')}
            borderRadius="50%"
            width="30px"
            height="30px"
            backgroundColor="#90EE00"
            border="1px solid #000"
            _hover={{ backgroundColor: "#76B900" }}
            mr={2}
          />
          <Button
            onClick={() => onChange('lightyellow')}
            borderRadius="50%"
            width="30px"
            height="30px"
            backgroundColor="#FFFACD"
            _hover={{ backgroundColor: "#FFE9A5" }}
            border="1px solid #000"
          />
        </Box>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
