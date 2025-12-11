import React, { useState, useEffect } from 'react';
import { Box, Card } from '@chakra-ui/react';

import LinkList from '../components/LinkList';
import DateCounter from '../components/DateCounter';
import Goals from '../components/Goals';
import Note from '../components/Note';
import ColorPicker from '../components/ColorPicker';
import CustomColorManager from '../components/CustomColorManager';

export default function Dashboard() {

  // bgColor 통합 관리
  const [bgColors, setBgColors] = useState({
    linkList: localStorage.getItem('linkListColor') || 'white',
    note: localStorage.getItem('noteColor') || 'white',
    dateCounter: localStorage.getItem('dateCounterColor') || 'white',
    goals: localStorage.getItem('goalsColor') || 'white',
  });

  // 사용자 색상 목록
  const [customColors, setCustomColors] = useState(
    JSON.parse(localStorage.getItem("customColors")) || []
  );

  // CustomColorManager → Dashboard 로 색 업데이트
  const handleSaveCustomColors = (colors) => {
    setCustomColors(colors);
  };

  // bgColor 변경 처리
  const setBgColor = (title, color) => {
    setBgColors(prev => ({
      ...prev,
      [title]: color
    }));
    localStorage.setItem(`${title}Color`, color);
  };

  const components = [
    { id: 'dateCounter', content: <DateCounter /> },
    { id: 'goals', content: <Goals /> },
  ];

  return (
    <Box margin="40px">

      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "3fr 2fr 2fr" }}
        gap={4}
      >

        {/* LEFT */}
        <Card background={bgColors.linkList} padding="10px">
          <LinkList />
          <ColorPicker
            onChange={(color) => setBgColor('linkList', color)}
            customColors={customColors}
          />
        </Card>

        {/* CENTER */}
        <Card background={'transparent'} padding="10px">
          {components.map((component) => (
            <Card
              key={component.id}
              background={bgColors[component.id]}
              padding="10px"
              marginBottom="20px"
            >
              {component.content}

              <ColorPicker
                onChange={(color) => setBgColor(component.id, color)}
                customColors={customColors}
              />
            </Card>
          ))}
        </Card>

        {/* RIGHT */}
        <Card background={bgColors.note} padding="10px">
          <Note />
          <ColorPicker
            onChange={(color) => setBgColor('note', color)}
            customColors={customColors}
          />
        </Card>

      </Box>

      {/* 우측 슬라이드 */}
      <CustomColorManager onSaveCustomColors={handleSaveCustomColors} />

    </Box>
  );
}
