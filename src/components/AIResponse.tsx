import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

interface AIResponseProps {
    response: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ response }) => {
    return (
        <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
        >
            <Heading as="h2" size="md" mb={2}>
                AI Response
            </Heading>
            <Text whiteSpace="pre-wrap">{response}</Text>
        </Box>
    );
};

export default AIResponse;
