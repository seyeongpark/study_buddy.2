import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react'; // Chakra UI components import
import Dashboard from './layouts/index';
import './App.css';
import ColorPicker from './ColorPicker'; // Adjust the path if necessary

function App() {
  // 로컬 스토리지에서 저장된 색상을 불러와 초기 값으로 설정
  const storedColor = localStorage.getItem('selectedColor') || '#282c34';
  const [bgColor, setBgColor] = useState(storedColor); // Default background color
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
    localStorage.setItem('selectedColor', color); // 로컬 스토리지에 배경색 저장
  };

  // useEffect for setting initial body background color and updating current time every second
  useEffect(() => {
    // 페이지 로드 시 저장된 배경색을 적용
    document.body.style.backgroundColor = bgColor;

    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [bgColor]);

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
