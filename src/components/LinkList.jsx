import React, { useState, useEffect } from 'react';
import { Stack, Text, Input,
  Box, Grid, Flex, Spacer,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardHeader, Heading, CardBody, CardFooter, Button, IconButton,
  UnorderedList, ListItem } from '@chakra-ui/react';

import { CloseIcon } from '@chakra-ui/icons'

function LinkList() {
  const defaultLinks = [
    "https://www.cbc.ca/news",
    "https://nationalpost.com/",
    "https://www.ted.com/read/ted-studies",
    "https://www.celpip.ca/"
  ];

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    // Load default links
    setLinks(defaultLinks);
  
    // Load additional links from localStorage
    const storedLinks = JSON.parse(localStorage.getItem('links'));
    if (storedLinks) {
      setLinks(storedLinks);
    }
  }, []);  

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (newLink) {
      const normalizedLink = normalizeLink(newLink);
      setLinks([...links, normalizedLink]);
      setNewLink('');
    }
  };

  const deleteLink = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    localStorage.setItem('links', JSON.stringify(updatedLinks));
  };

  const openMultipleLinks = () => {
    links.forEach(link => {
      window.open(link, "_blank");
    });
  };

  // Function to normalize a link by adding "https://" if it's missing
  const normalizeLink = (link) => {
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "https://" + link;
    }
    return link;
  };

  return (
    <>
    <CardHeader fontSize='2xl'>
      {/* Link List */}
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>Study</Tab>
          <Tab>🎶</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <Box>
            <Stack>
              <Input 
                size='lg'
                type="text"
                placeholder="Add a link"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
              />
              <Button onClick={addLink}>Add</Button>
            </Stack>
            <CardBody>
            <UnorderedList>
              {links.map((link, index) => (
                <ListItem key={index}>
                  <Text href={link} target="_blank" fontSize='md'>{link}
                    <IconButton 
                      onClick={() => deleteLink(index)} 
                      colorScheme='tomato'
                      color='tomato'
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
                  </Text>
                </ListItem>
              ))}
            </UnorderedList>
          </CardBody>
          <CardFooter justifyContent="flex-end">
            <Button onClick={openMultipleLinks}>Open Links</Button>
          </CardFooter>
          </Box>
            
          </TabPanel>
          <TabPanel>
            COMING SOON
          </TabPanel>
        </TabPanels>
      </Tabs>
    </CardHeader>
    </>
  );
}

export default LinkList;
