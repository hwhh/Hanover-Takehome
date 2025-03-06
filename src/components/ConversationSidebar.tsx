import React from 'react';
import { Box, List, ListItem, Button, Text } from '@chakra-ui/react';
import { Conversation } from '../types';

interface ConversationSidebarProps {
    conversations: Conversation[];
    onSelect: (conv: Conversation) => void;
    onNewConversation: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ conversations, onSelect, onNewConversation }) => {
    return (
        <Box width="300px" bg="gray.100" p={4} overflowY="auto" borderRight="1px solid" borderColor="gray.200">
            <Button colorScheme="blue" width="100%" mb={4} onClick={onNewConversation}>
                + New Chat
            </Button>
            <List spacing={2}>
                {conversations.map((conv) => (
                    <ListItem
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        cursor="pointer"
                        borderWidth="1px"
                        p={2}
                        borderRadius="md"
                    >
                        <Text fontSize="sm">
                            {/* Show first 30 characters of the first user message, if available */}
                            {conv.messages[0]?.content.substring(0, 30) || 'New Conversation'}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ConversationSidebar;
