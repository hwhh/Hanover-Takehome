import React from 'react';
import { Box, List, ListItem, Button, Text, IconButton, Flex } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Conversation } from '../types';

interface ConversationSidebarProps {
    conversations: Conversation[];
    onSelect: (conv: Conversation) => void;
    onNewConversation: () => void;
    onDelete: (convId: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ conversations, onSelect, onNewConversation, onDelete }) => {
    return (
        <Box width="300px" bg="gray.100" p={4} overflowY="auto" borderRight="1px solid" borderColor="gray.200">
            <Button colorScheme="blue" width="100%" mb={4} onClick={onNewConversation}>
                + New Chat
            </Button>
            <List spacing={2}>
                {conversations.map((conv) => (
                    <ListItem
                        key={conv.id}
                        borderWidth="1px"
                        p={2}
                        borderRadius="md"
                    >
                        <Flex justify="space-between" align="center">
                            <Text
                                onClick={() => onSelect(conv)}
                                cursor="pointer"
                                fontSize="sm"
                            >
                                {conv.messages[0]?.content.substring(0, 30) || 'New Conversation'}
                            </Text>
                            <IconButton
                                aria-label="Delete conversation"
                                icon={<DeleteIcon />}
                                size="sm"
                                onClick={() => onDelete(conv.id)}
                            />
                        </Flex>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ConversationSidebar;
