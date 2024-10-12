import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react'; // Chakra UI components import
import Dashboard from './layouts/index';
import './App.css';
import ColorPicker from './ColorPicker'; // Adjust the path if necessary

function App() {
  const [bgColor, setBgColor] = useState('#282c34'); // Default background color
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  // 시간 형식을 지정하는 함수
  function getFormattedTime() {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    const now = new Date();
    return now.toLocaleString('en-US', options);
  }

  // Update body background color
  const changeBackgroundColor = (color) => {
    setBgColor(color);
    document.body.style.backgroundColor = color; // Apply the color to the body
  };

  // useEffect for updating the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Box>
        <Stack margin='20px'>
          <Text
            fontSize='4xl'
            color={bgColor === '#14213D' ? 'white' : 'black'} // 조건에 따라 텍스트 색상 설정
          >
            {currentTime}
          </Text>
        </Stack>
      </Box>
      <ColorPicker onChange={changeBackgroundColor} />
      <Dashboard />
    </div>
  );
}

export default App;
