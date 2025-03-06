import React, { useState } from 'react';
import { Flex, Box, Spinner, Text } from '@chakra-ui/react';
import SearchForm from './components/SearchForm';
import ConversationSidebar from './components/ConversationSidebar';
import useOpenAi from './hooks/useOpenAi';

import useConversations from './hooks/useConversations';
import useSerpAPI from "./hooks/useSerpAPI.ts";
import ConversationView from "./components/ChatView.tsx";

const App: React.FC = () => {
    const {
        conversations,
        currentConversation,
        startNewConversation,
        addMessageToCurrentConversation,
        selectConversation,
    } = useConversations();
    const { generateAiResponse } = useOpenAi();
    const { searchGoogle } = useSerpAPI();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            // Start a new conversation if none exists.
            if (!currentConversation) {
                startNewConversation();
            }
            // Append the user's message.
            addMessageToCurrentConversation({
                role: 'user',
                content: query,
                timestamp: Date.now(),
            });

            // Perform the search using SerpAPI.
            const results = await searchGoogle(query);
            let aiAnswer = '';
            if (results.length === 0) {
                aiAnswer = 'No search results found. Please refine your query.';
            } else {
                aiAnswer = await generateAiResponse({
                    query,
                    searchResults: results,
                });
            }

            // Append the assistant's message and include the search results.
            addMessageToCurrentConversation({
                role: 'assistant',
                content: aiAnswer,
                timestamp: Date.now(),
                searchResults: results, // <-- Store the search results!
            });
        } catch (error) {
            console.error('Error during search:', error);
            addMessageToCurrentConversation({
                role: 'assistant',
                content: 'There was an error processing your request. Please try again later.',
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex height="100vh">
            {/* Left Sidebar */}
            <ConversationSidebar
                conversations={conversations}
                onSelect={(conv) => selectConversation(conv)}
                onNewConversation={startNewConversation}
            />
            {/* Main Conversation Area */}
            <Flex direction="column" flex="1" position="relative">
                <Box flex="1" overflowY="auto" p={4}>
                    {currentConversation ? (
                        <ConversationView conversation={currentConversation} />
                    ) : (
                        <Text>No conversation selected. Start a new chat from the sidebar.</Text>
                    )}
                    {loading && (
                        <Flex alignItems="center" mt={4}>
                            <Spinner mr={2} />
                            <Text>Processing your message...</Text>
                        </Flex>
                    )}
                </Box>
                {/* Constant Search Bar */}
                <Box
                    borderTop="1px solid"
                    borderColor="gray.200"
                    p={4}
                    position="sticky"
                    bottom={0}
                    bg="white"
                >
                    <SearchForm onSubmit={handleSearch} loading={loading} />
                </Box>
            </Flex>
        </Flex>
    );
};

export default App;
