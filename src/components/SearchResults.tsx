import React from 'react';
import { Box, Heading, List, ListItem, Text, Link } from '@chakra-ui/react';

export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

interface SearchResultsProps {
    results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    return (
        <Box mb={8}>
            <Heading as="h2" size="md" mb={2}>
                Search Results
            </Heading>
            <List spacing={3}>
                {results.map((result, index) => (
                    <ListItem key={index} borderBottom="1px solid #eee" pb={3} mb={3}>
                        <Text fontWeight="bold">{result.title}</Text>
                        <Link href={result.link} color="blue.500" isExternal>
                            {result.link}
                        </Link>
                        <Text>{result.snippet}</Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SearchResults;
