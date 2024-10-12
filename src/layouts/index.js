import React, { useState, useEffect } from 'react';
import { Stack, Text, Input, Box, Flex, Card } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LinkList from '../components/LinkList';
import DateCounter from '../components/DateCounter';
import Goals from '../components/Goals';
import Note from '../components/Note';
import ColorPicker from '../components/ColorPicker'; 

export default function Dashboard() {  
  // 색상 정보를 로컬 스토리지에서 불러오기
  const initialComponents = [
    { id: 'linkList', content: <LinkList />, bgColor: localStorage.getItem('linkListColor') || 'white' },
    { id: 'dateCounter', content: <DateCounter />, bgColor: localStorage.getItem('dateCounterColor') || 'white' },
    { id: 'note', content: <Note />, bgColor: localStorage.getItem('noteColor') || 'white' },
    { id: 'goals', content: <Goals />, bgColor: localStorage.getItem('goalsColor') || 'white' },
  ];
  
  const [components, setComponents] = useState(initialComponents);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newComponents = Array.from(components);
    const [movedItem] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, movedItem);
    setComponents(newComponents);
  };

  const handleColorChange = (index, color) => {
    // color가 유효하지 않거나 'transparent'인 경우 기본값으로 '#fff' 설정
    const selectedColor = (color);
  
    const newComponents = [...components];
    newComponents[index].bgColor = selectedColor; // 색상 업데이트
    setComponents(newComponents);
  
    // localStorage에 색상 저장
    switch (newComponents[index].id) {
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
    <Box margin='40px'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={4}
              minHeight="auto"
            >
              {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      background={snapshot.isDragging ? "lightblue" : "transparent"}
                      marginBottom="8px"
                      borderRadius="4px"
                      boxShadow={snapshot.isDragging ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "none"}
                      {...provided.draggableProps.style}
                    >
                      <Card background={component.bgColor === 'transparent' ? 'white' : component.bgColor}>
                      {component.content}
                      <ColorPicker onChange={(color) => handleColorChange(index, color)} />
                    </Card>

                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
