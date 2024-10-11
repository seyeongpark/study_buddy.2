import React, { useState, useEffect } from 'react';
import {
  Stack, Text, Input, Box, Button,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardHeader, CardBody, UnorderedList,
  ListItem, IconButton, CardFooter, Flex
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

function LinkList() {
  const defaultLinks = [
    "https://www.cbc.ca/news",
    "https://nationalpost.com/",
    "https://www.ted.com/read/ted-studies",
    "https://www.celpip.ca/"
  ];

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [newIframe, setNewIframe] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    setLinks(defaultLinks);
    const storedLinks = JSON.parse(localStorage.getItem('links'));
    if (storedLinks) setLinks(storedLinks);
    const storedIframe = localStorage.getItem('iframeSrc');
    if (storedIframe) setIframeSrc(storedIframe);
  }, []);

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
    localStorage.setItem('iframeSrc', iframeSrc);
  }, [links, iframeSrc]);

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
  };

  const openMultipleLinks = () => {
    links.forEach(link => {
      window.open(link, "_blank");
    });
  };

  const normalizeLink = (link) => {
    return (link.startsWith("http://") || link.startsWith("https://")) ? link : "https://" + link;
  };

  const handleIframeChange = () => {
    const regex = /<iframe[^>]+src="([^"]+)"/; // Adjusted regex to check for iframe
    const match = regex.exec(newIframe);
    
    if (match && match[1]) {
      const srcValue = match[1];
      setIframeSrc(srcValue);
      localStorage.setItem('iframeSrc', srcValue);
    } else {
      alert('Invalid iframe embed code. Please check the format.'); // Show warning
    }
    
    setNewIframe(''); // Clear input field
  };  

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNewIframe(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <>
      <CardHeader fontSize='2xl'>
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
              <Flex align="center">
                <Button onClick={pasteFromClipboard} marginRight="10px">Paste</Button>
                <Input
                  value={newIframe}
                  onChange={(e) => setNewIframe(e.target.value)}
                  placeholder="Insert iframe from Spotify"
                  width="200px"
                />
                <Button onClick={handleIframeChange} marginLeft="10px" size="lg">DROP THE BEAT 📀</Button>
              </Flex>
              {iframeSrc && (
                <Box marginTop="10px">
                  <iframe
                    style={{
                      borderRadius: '12px',
                      width: '100%',
                      height: '352px',
                    }}
                    src={iframeSrc}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardHeader>
    </>
  );
}

export default LinkList;
