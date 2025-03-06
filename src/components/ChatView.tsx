import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Conversation } from '../types';
import SearchResults from './SearchResults';

interface ConversationViewProps {
    conversation: Conversation;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation }) => {
    return (
        <VStack align="stretch" spacing={4} p={4}>
            {conversation.messages.map((msg, index) => (
                <Box key={index} bg={msg.role === 'assistant' ? 'gray.100' : 'blue.50'} p={3} borderRadius="md">
                    <Text fontWeight="bold">{msg.role === 'assistant' ? 'Assistant' : 'You'}</Text>
                    <Text>{msg.content}</Text>
                    {msg.role === 'assistant' && msg.searchResults && msg.searchResults.length > 0 && (
                        <Box mt={2}>
                            <SearchResults results={msg.searchResults} />
                        </Box>
                    )}
                </Box>
            ))}
        </VStack>
    );
};

export default ConversationView;
