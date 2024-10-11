import React, { useState, useEffect } from 'react';
import { Stack, Text, Input, Box, Grid, Flex, Spacer, Tabs, TabList, TabPanels, Tab, TabPanel, List,
  Card, CardHeader, Heading, CardBody, CardFooter, Button, IconButton,
  UnorderedList, ListItem } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

function Goals() {
  const [goal, setGoal] = useState('');
  const [goalList, setGoalList] = useState([]);

  // Load goalList and checked status from localStorage on component mount
  useEffect(() => {
    const storedGoalList = JSON.parse(localStorage.getItem('goalList')) || [];
    setGoalList(storedGoalList);
  }, []);

  // Update localStorage whenever goalList changes
  useEffect(() => {
    localStorage.setItem('goalList', JSON.stringify(goalList));
  }, [goalList]);

  const handleInputChange = (e) => {
    setGoal(e.target.value);
  };

  const addGoal = () => {
    if (goal.trim() !== '') {
      // Add a new goal with checked status set to false
      const newGoal = { goal: goal, checked: false };
      setGoalList([...goalList, newGoal]);
      setGoal('');
    }
  };

  const deleteGoal = (index) => {
    // Create a copy of goalList without the goal to be deleted
    const updatedGoalList = [...goalList];
    updatedGoalList.splice(index, 1);
    setGoalList(updatedGoalList);
  };

  const resetGoals = () => {
    // Reset the checked status for all goals to false
    const resetGoalList = goalList.map((item) => ({
      ...item,
      checked: false,
    }));
    setGoalList(resetGoalList);
  };

  return (
    <>
    <CardHeader fontSize='2xl'>
      <Button 
        onClick={resetGoals}
        colorScheme='gray'
        color='gray'
        marginLeft='20px'
        _hover={{ 
        bg: 'green',
        color: '#fff',
        transform: 'scale(0.98)',
        }}
        size='sm'
        variant='outline'>
          Reset
      </Button>
    </CardHeader>
    <CardBody>
      <List>
        {goalList.map((item, index) => (
          <ListItem key={index} marginBottom='10px'>
            <Flex alignItems="center">
              <Checkbox
                size='lg'
                marginRight='15px' 
                colorScheme='green'
                isChecked={item.checked} // Bind the checked status to the Checkbox
                onChange={() => {
                  // Toggle the checked status when the Checkbox is clicked
                  const updatedGoalList = [...goalList];
                  updatedGoalList[index].checked = !item.checked;
                  setGoalList(updatedGoalList);
                }}
              />
              <Text fontSize='lg'>{item.goal}</Text>
              <IconButton 
                onClick={() => deleteGoal(index)}
                colorScheme='gray'
                color='gray'
                marginLeft='20px'
                _hover={{ 
                  bg: 'tomato',
                  color: '#fff',
                  transform: 'scale(0.98)',
                }}
                size='sm'
                variant='outline'
                aria-label='Delete'
                icon={<CloseIcon/>}/>
            </Flex>
          </ListItem>
        ))}
      </List>
    </CardBody>
    <CardFooter>
        <Input  
          size='lg'
          type="text"
          placeholder="Let's set a new goal!"
          value={goal}
          onChange={handleInputChange}
        />
        <Button 
          onClick={addGoal}
          bg='none'
          marginLeft='10px'
          _hover={{ 
            color: '#fff',
            transform: 'scale(3.3)'}}
            >
              🍀
            </Button>
    </CardFooter>
    </>
  );
}

export default Goals;
