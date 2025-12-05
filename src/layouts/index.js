import React, { useState } from 'react';
import { Box, Card } from '@chakra-ui/react';
import LinkList from '../components/LinkList';
import DateCounter from '../components/DateCounter';
import Goals from '../components/Goals';
import Note from '../components/Note';
import ColorPicker from '../components/ColorPicker';

export default function Dashboard() {

  // 초기 컴포넌트 + 색상 로드
  const initialComponents = [
    // { id: 'linkList', content: <LinkList />, bgColor: localStorage.getItem('linkListColor') || 'white'},
    { id: 'dateCounter', content: <DateCounter />, bgColor: localStorage.getItem('dateCounterColor') || 'white' },
    // { id: 'note', content: <Note />, bgColor: localStorage.getItem('noteColor') || 'white' },
    { id: 'goals', content: <Goals />, bgColor: localStorage.getItem('goalsColor') || 'white' },
  ];

  const [components, setComponents] = useState(initialComponents);

  // 색상 변경 처리
  const handleColorChange = (index, color) => {
    const selectedColor = color;
    const updated = [...components];
    updated[index].bgColor = selectedColor;
    setComponents(updated);

    // localStorage 저장
    switch (updated[index].id) {
      case 'linkList':
        localStorage.setItem('linkListColor', selectedColor);
        break;
      case 'dateCounter':
        localStorage.setItem('dateCounterColor', selectedColor);
        break;
      case 'note':
        localStorage.setItem('noteColor', selectedColor);
        break;
      case 'goals':
        localStorage.setItem('goalsColor', selectedColor);
        break;
      default:
        break;
    }
  };

  return (
    <Box margin="40px">
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "3fr 2fr 2fr" }}
        gap={4}
      >

        {/* 왼쪽 */}
        <Card
          background={'white'}
          padding="10px"
        >
           <LinkList />
        </Card>

        {/* 오른쪽 */}
        <Card
            background={'transparent'}
            padding="10px"
          >
            {components.map((component, index) => (
          <Card
            key={component.id}
            background={component.bgColor === 'transparent' ? 'white' : component.bgColor}
            padding="10px" marginBottom="20px"
          >
            {component.content}
            <ColorPicker onChange={(color) => handleColorChange(index, color)} />
          </Card>
        ))}
          </Card>

        <Card
          background={'white'}
          padding="10px"
        >
           <Note />
        </Card>
      </Box>
      
    </Box>
  );
}
