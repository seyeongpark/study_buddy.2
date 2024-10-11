import React, { useState, useEffect } from 'react';
import { Textarea, Card, CardHeader, CardBody, CardFooter, Box } from '@chakra-ui/react';

function Note() {
  const [text, setText] = useState('');

  // Load the saved text from localStorage on component mount
  useEffect(() => {
    const storedText = localStorage.getItem('note') || '';
    setText(storedText);
  }, []);

  // Save the text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('note', text);
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 엔터 동작 방지
      const cursorPosition = e.target.selectionStart;
      const beforeCursor = text.slice(0, cursorPosition);
      
      // 새 줄에 '- ' 추가
      const newText = `${beforeCursor.trimEnd()}\n- `;
      setText(newText);

      // 커서를 새로 삽입된 '- ' 뒤로 이동
      setTimeout(() => {
        e.target.selectionStart = newText.length;
        e.target.selectionEnd = newText.length;
      }, 0);
    }
  };

  // const resetNote = () => {
  //   // Clear the note
  //   setText('');
  //   localStorage.removeItem('note');
  // };

  return (
    <>
    <Card margin="0 auto" borderRadius="md">
      <CardHeader fontSize="2xl" textAlign="center">
      </CardHeader>
      <CardBody>
        <Textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Let's start your dream..."
          size="sm"
          minHeight="200px"
          resize="none"
          fontSize="lg"
        />
      </CardBody>
      <CardFooter textAlign="center">
        <Box fontSize="sm" color="gray.500">
          Press "Enter" to add a new line with "-". Use "Shift + Enter" for a new line without "-".
        </Box>
      </CardFooter>
    </Card>
  </>
  );
}

export default Note;
