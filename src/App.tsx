// src/App.tsx
import React, {useCallback, useState} from 'react';
import { Flex, Box, Spinner, Text } from '@chakra-ui/react';
import SearchForm from './components/SearchForm';
import ConversationSidebar from './components/ConversationSidebar';
import ConversationView from './components/ConversationView';
import useOpenAi from './hooks/useOpenAi';
import useConversations from './hooks/useConversations';
import useSerpAPI from "./hooks/useSerpAPI.ts";
import {withTimeout} from "./utils/withTimeout.ts";

const App: React.FC = () => {
    const {
        conversations,
        currentConversation,
        sendMessage,
        selectConversation,
        startNewConversation,
        deleteConversation,
    } = useConversations();    const { generateAiResponse } = useOpenAi();
    const { searchGoogle } = useSerpAPI();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = useCallback(async (query: string) => {
        setLoading(true);
        try {
            // Append the user's message.
            sendMessage({
                role: 'user',
                content: query,
                timestamp: Date.now(),
            });

            const results = await withTimeout(searchGoogle(query), 200000).catch((err) => {
                console.error("Search timed out or failed:", err);
                return []; // fallback: empty search results
            });

            let aiAnswer = "";
            if (results.length === 0) {
                aiAnswer = "No search results found. Please refine your query.";
            } else {
                aiAnswer = await withTimeout(generateAiResponse({ query, searchResults: results }), 200000).catch((err) => {
                    console.error("AI response timed out or failed:", err);
                    return "Partial response: AI service timed out.";
                });
            }

            sendMessage({
                role: 'assistant',
                content: aiAnswer,
                timestamp: Date.now(),
                searchResults: results,
            });
        } catch (error) {
            console.error("Error during search:", error);
            sendMessage({
                role: 'assistant',
                content: "There was an error processing your request. Please try again later.",
                timestamp: Date.now(),
            });
        } finally {
            setLoading(false);
        }
    }, [sendMessage, generateAiResponse, searchGoogle]);
    return (
        <Flex height="100vh">
            <ConversationSidebar
                conversations={conversations}
                onSelect={(conv) => selectConversation(conv)}
                onNewConversation={startNewConversation}
                onDelete={deleteConversation}
            />
            <Flex direction="column" flex="1" position="relative">
                <Box flex="1" overflowY="auto" p={4}>
                    {currentConversation ? (
                        <ConversationView conversation={currentConversation} />
                    ) : (
                        <Text>No conversation selected. Start a new chat from the sidebar.</Text>
                    )}
                    {loading && (
                        <Flex justifyContent="center" alignItems="center" mt={4}>
                            <Spinner mr={2} />
                            <Text>Processing your message...</Text>
                        </Flex>
                    )}
                </Box>
                <Box borderTop="1px solid" borderColor="gray.200" p={4} position="sticky" bottom={0} bg="white">
                    <SearchForm onSubmit={handleSearch} loading={loading} />
                </Box>
            </Flex>
        </Flex>
    );
};

export default App;
