import React, { useState, FormEvent } from 'react';
import { Box, FormControl, Input, Button, Stack } from '@chakra-ui/react';

interface SearchFormProps {
    onSubmit: (query: string) => void;
    loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, loading = false }) => {
    const [query, setQuery] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSubmit(query);
            setQuery('');
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <Stack direction="row" spacing={4}>
                <FormControl>
                    <Input
                        placeholder="Type your message..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Send
                </Button>
            </Stack>
        </Box>
    );
};

export default SearchForm;
