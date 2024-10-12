import React from 'react';
import { Button, Box } from '@chakra-ui/react';
import chroma from 'chroma-js';

const ColorPicker = ({ onChange }) => {
  const colors = ['#fff', '#DAD7CD', '#14213D', '#1e90ff', '#ffa500'];

  const handleColorChange = (color) => {
    localStorage.setItem('selectedColor', color); // 선택한 색상을 localStorage에 저장
    onChange(color);
  };

  return (
    <Box>
      {colors.map((color) => {
        // 진한 색상을 계산
        const hoverColor = chroma(color).darken(1).hex();
        return (
          <Button
            key={color}
            backgroundColor={color}
            _hover={{
              backgroundColor: hoverColor,
            }}
            onClick={() => handleColorChange(color)}
            margin="5px"
            width="40px"
            height="40px"
            borderRadius="50%"
            border="1px solid #000"
          />
        );
      })}
    </Box>
  );
};

export default ColorPicker;
