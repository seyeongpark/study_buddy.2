import React, { useState, useEffect } from 'react';
import { Stack, Text, Box, Card } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LinkList from '../components/LinkList';
import DateCounter from '../components/DateCounter';
import Goals from '../components/Goals';
import Note from '../components/Note';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [components, setComponents] = useState([
    { id: 'linkList', content: <LinkList /> },
    { id: 'dateCounter', content: <DateCounter /> },
    { id: 'note', content: <Note /> },
    { id: 'goals', content: <Goals /> },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newComponents = Array.from(components);
    const [movedItem] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, movedItem);
    setComponents(newComponents);
  };

  return (
    <Box margin='40px'>
      <Box>
        <Stack marginBottom='20px'>
          <Text fontSize='4xl'>{currentTime}</Text>
        </Stack>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={4}
              minHeight= "auto"
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
                      <Card>{component.content}</Card>
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
