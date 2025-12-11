import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Flex
} from '@chakra-ui/react';

export default function CustomColorManager({ onSaveCustomColors }) {

  const [customColors, setCustomColors] = useState([]);
  const [newColor, setNewColor] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // 로컬스토리지 로드
  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("customColors")) || [];
    setCustomColors(loaded);
  }, []);

  // HEX 색상 추가
  const addCustomColor = (color) => {
    const value = color || newColor;

    if (!value.startsWith("#") || (value.length !== 4 && value.length !== 7)) {
      alert("HEX 색상(#FFF 또는 #FFFFFF)을 입력하세요.");
      return;
    }

    if (customColors.length >= 3) {
      alert("최대 3개까지만 저장 가능합니다.");
      return;
    }

    const updated = [...customColors, value];
    setCustomColors(updated);
    localStorage.setItem("customColors", JSON.stringify(updated));

    onSaveCustomColors && onSaveCustomColors(updated);

    setNewColor("");
  };

  // 삭제
  const removeCustomColor = (color) => {
    const updated = customColors.filter(c => c !== color);
    setCustomColors(updated);
    localStorage.setItem("customColors", JSON.stringify(updated));

    onSaveCustomColors && onSaveCustomColors(updated);
  };

  // 🔥 기본 색상 박스 (hover 시 + 아이콘 나타남)
  const PresetBox = ({ color }) => (
    <Box
      position="relative"
      w="35px"
      h="35px"
      borderRadius="50%"
      bg={color}
      border="1px solid #000"
      cursor="pointer"
      _hover={{
        "& > div": { opacity: 1 }
      }}
      onClick={() => addCustomColor(color)}
    >
      {/* hover 오버레이 */}
      <Box
        position="absolute"
        top="0" left="0"
        w="100%" h="100%"
        bg="rgba(0,0,0,0.4)"
        borderRadius="50%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize="22px"
        fontWeight="bold"
        opacity="0"
        transition="0.2s"
      >
        +
      </Box>
    </Box>
  );

  return (
    <>
      {/* 팔레트 버튼 */}
      <Button
        position="fixed"
        right="20px"
        top="10%"
        transform="translateY(-50%)"
        zIndex={1000}
        background={'white'}
        color={'gray'}
        onClick={onOpen}
      >
        Palette
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            🎨 Custom Color Manager
          </DrawerHeader>

          <DrawerBody>

            {/* HEX 입력 */}
            <Text mb={2}>HEX 컬러(#FFF / #FFFFFF) 입력:</Text>

            <Flex gap={2} mb={4}>
              <Input
                placeholder="#90EE90"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <Button colorScheme="blue" onClick={() => addCustomColor()}>
                추가
              </Button>
            </Flex>

            {/* ⭐ 기본 색상 */}
            <Text fontWeight="bold" mb={2}>⭐ 기본 색상 선택</Text>

            <Flex gap={3} mb={6}>
              <PresetBox color="#FFF9A3" />
              <PresetBox color="#FFD6E7" />
              <PresetBox color="#CCF3EE" />
            </Flex>

            {/* 저장된 색상 */}
            <Text fontWeight="bold" mb={2}>저장된 색상 (최대 3개)</Text>

            <Flex gap={4}>
              {customColors.map((c) => (
                <Flex key={c} align="center" direction="column">
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="50%"
                    background={c}
                    border="1px solid #000"
                    mb={1}
                  />
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => removeCustomColor(c)}
                  >
                    삭제
                  </Button>
                </Flex>
              ))}
            </Flex>

          </DrawerBody>

          <DrawerFooter>
            <Button onClick={onClose}>닫기</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
