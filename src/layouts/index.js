import React, { useState, useEffect } from 'react';
import { Stack, Text, 
  Box, Grid,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardHeader, Heading, CardBody, CardFooter } from '@chakra-ui/react';
import LinkList from '../components/LinkList';
import DateCounter from '../components/DateCounter';
import Goals from '../components/Goals';

export default function Dashboard (props) {

  const [currentTime, setCurrentTime] = useState(getFormattedTime());

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

  return (
    <Box margin='40px'>
      <Box>
        <Stack marginBottom='20px'>
          <Text fontSize='4xl'>{currentTime}</Text>
        </Stack>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box gridRow="span 3">
          <Card>
            <LinkList/>
          </Card>
        </Box>
        <Box>
          <Card>
            <DateCounter/>
          </Card>
        </Box>
        <Box>
          <Card>
            <Goals/>
          </Card>
        </Box>
        {/* <Box bg='green'>
        Component4 (wish)
        </Box> */}
      </Grid>
    </Box>
  );
}