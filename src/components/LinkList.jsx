import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  UnorderedList,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  useDisclosure,
  HStack,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon, DragHandleIcon } from "@chakra-ui/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ---------------------- Utility helpers ----------------------
const uid = () => Date.now().toString();

const defaultTabs = [
  { id: "study", name: "Study", type: "links", icon: "📚", links: ["https://www.cbc.ca/news"] },
  { id: "music", name: "Music", type: "music", icon: "🎵", iframeSrc: "" },
];

const saveToStorage = (tabs, activeTabId) => {
  localStorage.setItem("studybuddy_tabs", JSON.stringify(tabs));
  localStorage.setItem("studybuddy_active", activeTabId ?? "");
};

const loadFromStorage = () => {
  try {
    const tabs = JSON.parse(localStorage.getItem("studybuddy_tabs"));
    const active = localStorage.getItem("studybuddy_active");
    if (tabs && Array.isArray(tabs) && tabs.length) return { tabs, active };
  } catch (e) {
    // ignore
  }
  return { tabs: defaultTabs, active: defaultTabs[0].id };
};

// ---------------------- LinksPanel ----------------------
function LinksPanel({ tab, updateTab }) {
  const [newLink, setNewLink] = useState("");

  const normalizeLink = (link) => {
    if (!link) return "";
    return link.startsWith("http://") || link.startsWith("https://") ? link : "https://" + link;
  };

  const addLink = () => {
    if (!newLink.trim()) return;
    const normalized = normalizeLink(newLink.trim());
    updateTab({ ...tab, links: [...(tab.links || []), normalized] });
    setNewLink("");
  };

  const deleteLink = (idx) => {
    const next = [...(tab.links || [])];
    next.splice(idx, 1);
    updateTab({ ...tab, links: next });
  };

  const openMultipleLinks = () => {
    if (!tab.links || tab.links.length === 0) return;

    tab.links.forEach(link => {
      window.open(link, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Box>
      <Stack spacing={3}>
        <HStack>
          <Input
            placeholder="Add a link (e.g. example.com or https://example.com)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            size="md"
          />
          <Button onClick={addLink} colorScheme="green">
            Add
          </Button>
        </HStack>

        <Card>
          <CardBody>
            <UnorderedList>
              {(tab.links || []).map((link, i) => (
                <ListItem key={i} display="flex" alignItems="center" justifyContent="space-between">
                  <Text as="a" href={link} target="_blank" rel="noreferrer" maxWidth="80%" isTruncated>
                    {link}
                  </Text>
                  <IconButton
                    aria-label="Delete link"
                    icon={<CloseIcon />}
                    size="sm"
                    onClick={() => deleteLink(i)}
                    variant="ghost"
                  />
                </ListItem>
              ))}
            </UnorderedList>
          </CardBody>
          <CardFooter justifyContent="flex-end">
            <Button onClick={openMultipleLinks}>Open Links</Button>
          </CardFooter>
        </Card>
      </Stack>
    </Box>
  );
}

// ---------------------- MusicPanel ----------------------
function MusicPanel({ tab, updateTab }) {
  const [newIframe, setNewIframe] = useState("");

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNewIframe(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleIframeChange = () => {
    const regex = /<iframe[^>]+src=\"([^\"]+)\"/;
    const match = regex.exec(newIframe);
    if (match && match[1]) {
      updateTab({ ...tab, iframeSrc: match[1] });
    } else {
      alert("Invalid iframe embed code. Please paste the full iframe markup (e.g. Spotify embed).");
    }
    setNewIframe("");
  };

  return (
    <Box>
      <Flex mb={3} alignItems="center">
        <Button onClick={pasteFromClipboard} mr={2} size="sm">
          Paste
        </Button>
        <Input
          value={newIframe}
          onChange={(e) => setNewIframe(e.target.value)}
          placeholder="Paste iframe embed code here"
          size="md"
          width="70%"
        />
        <Button ml={2} onClick={handleIframeChange} colorScheme="green" width="20px">
          ▶
        </Button>
      </Flex>

      {tab.iframeSrc ? (
        <Box borderRadius="12px" overflow="hidden">
          <iframe
            title={`${tab.name}-embed`}
            src={tab.iframeSrc}
            style={{ width: "100%", height: 360, border: 0 }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </Box>
      ) : (
        <Text color="gray.500">No music embed yet — paste a Spotify (or other) iframe.</Text>
      )}
    </Box>
  );
}

// ---------------------- Icon Picker ----------------------
function SimpleIconPicker({ value, onChange }) {
  const icons = ["📚", "🎵", "📝", "🔖", "⭐", "📁", "💡", "🔥", "🧠"];
  return (
    <HStack>
      {icons.map((ic) => (
        <Button key={ic} size="sm" variant={value === ic ? "solid" : "ghost"} onClick={() => onChange(ic)}>
          {ic}
        </Button>
      ))}
    </HStack>
  );
}

// ---------------------- Main Component ----------------------
export default function LinkList() {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTabName, setNewTabName] = useState("");
  const [newTabType, setNewTabType] = useState("links");
  const [newTabIcon, setNewTabIcon] = useState("📚");

  useEffect(() => {
    const { tabs: loadedTabs, active } = loadFromStorage();
    setTabs(loadedTabs);
    setActiveTabId(active || (loadedTabs[0] && loadedTabs[0].id));
  }, []);

  useEffect(() => {
    saveToStorage(tabs, activeTabId);
  }, [tabs, activeTabId]);

  const updateTab = (nextTab) => {
    setTabs((prev) => prev.map((t) => (t.id === nextTab.id ? nextTab : t)));
  };

  const addNewTab = () => {
    if (!newTabName.trim()) return;
    const tab = {
      id: uid(),
      name: newTabName.trim(),
      type: newTabType,
      icon: newTabIcon,
      links: newTabType === "links" ? [] : undefined,
      iframeSrc: newTabType === "music" ? "" : undefined,
    };
    const next = [...tabs, tab];
    setTabs(next);
    setActiveTabId(tab.id);
    setNewTabName("");
    setNewTabType("links");
    setNewTabIcon("📚");
    onClose();
  };

  const deleteTab = (id) => {
    if (!window.confirm("이 탭을 지울까요?")) return;
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (activeTabId === id) {
      setActiveTabId(next[0] ? next[0].id : null);
    }
  };

  // Drag & Drop handlers (reordering tabs)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIdx = result.source.index;
    const destIdx = result.destination.index;
    if (sourceIdx === destIdx) return;
    const copy = Array.from(tabs);
    const [moved] = copy.splice(sourceIdx, 1);
    copy.splice(destIdx, 0, moved);
    setTabs(copy);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <Box>
      <Card>
        <CardHeader>
          <VStack align="start" spacing={2}>
            <Heading size="md">Quick Links</Heading>
            <Text fontSize="sm" color="gray.500">
              Create tabs, add links or music embeds, reorder and customize icons.
            </Text>
          </VStack>
        </CardHeader>

        <CardBody>
          <Stack spacing={4}>
            {/* Tab bar with drag & drop */}
            <DragDropContext onDragEnd={onDragEnd}>
              {/* --- Use a plain div for Droppable container to ensure ref works reliably --- */}
              <Droppable droppableId="tabs-droppable" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 8 }}
                  >
                    {tabs.map((tab, index) => (
                      <Draggable key={tab.id} draggableId={tab.id} index={index}>
                        {(draggableProvided, snapshot) => {
                          // baseTransform may be like "translate(0px, 0px)" — append scale when dragging
                          const baseTransform = draggableProvided.draggableProps.style?.transform || "";
                          const scaleTransform = snapshot.isDragging ? `${baseTransform} scale(1.05)` : baseTransform;

                          return (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: 8,
                                opacity: snapshot.isDragging ? 0.7 : 1,
                                transform: scaleTransform,
                                transition: "opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease",
                                backgroundColor: snapshot.isDragging ? "rgba(255,255,255,0.6)" : "transparent",
                                // merge any styles rbd provides (position/transform)
                                ...(draggableProvided.draggableProps.style || {}),
                              }}
                              onMouseEnter={(e) => {
                                if (!snapshot.isDragging) {
                                  e.currentTarget.style.backgroundColor = "#e9e9e9";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!snapshot.isDragging) {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              <Flex
                                alignItems="center"
                                bg={tab.id === activeTabId ? "green.50" : "gray.50"}
                                borderRadius="md"
                                px={3}
                                py={2}
                                minWidth="120px"
                                boxShadow={snapshot.isDragging ? "lg" : "sm"}
                                width="100%"
                              >
                                <Box {...draggableProvided.dragHandleProps} mr={2} cursor="grab">
                                  <DragHandleIcon />
                                </Box>

                                <Button
                                  variant="ghost"
                                  onClick={() => setActiveTabId(tab.id)}
                                  flexGrow={1}
                                  justifyContent="flex-start"
                                  leftIcon={<Text as="span">{tab.icon}</Text>}
                                >
                                  <Text isTruncated maxWidth="110px">
                                    {tab.name}
                                  </Text>
                                </Button>

                                <IconButton
                                  size="sm"
                                  onClick={() => deleteTab(tab.id)}
                                  aria-label={`Delete ${tab.name}`}
                                  icon={<CloseIcon />}
                                  variant="ghost"
                                  ml={2}
                                />
                              </Flex>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {/* Add tab quick button */}
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                      <Button leftIcon={<AddIcon />} onClick={onOpen} colorScheme="green">
                        Add Tab
                      </Button>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Active tab content area */}
            <Box>
              {activeTab ? (
                <Box>
                  {activeTab.type === "links" && <LinksPanel tab={activeTab} updateTab={updateTab} />}

                  {activeTab.type === "music" && <MusicPanel tab={activeTab} updateTab={updateTab} />}
                </Box>
              ) : (
                <Text>아직 Tab이 없군요. 하나 만들어볼까요?</Text>
              )}
            </Box>
          </Stack>
        </CardBody>

        <CardFooter />
      </Card>

      {/* Add Tab Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new tab</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input
                placeholder="Tab name (e.g. Reading, Research)"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
              />

              <Select value={newTabType} onChange={(e) => setNewTabType(e.target.value)}>
                <option value="links">Links (bookmark list)</option>
                <option value="music">Music (embed iframe)</option>
              </Select>

              <Box>
                <Text mb={2}>Choose an icon</Text>
                <SimpleIconPicker value={newTabIcon} onChange={setNewTabIcon} />
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={addNewTab}>
              Create Tab
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
