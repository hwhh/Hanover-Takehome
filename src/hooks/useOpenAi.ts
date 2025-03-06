import { useCallback } from 'react';

export interface OpenAiParams {
    query: string;
    searchResults: {
        title: string;
        link: string;
        snippet: string;
    }[];
}

const useOpenAi = () => {
    const generateAiResponse = useCallback(async ({ query, searchResults }: OpenAiParams): Promise<string> => {
        const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!openAIApiKey) {
            throw new Error('Missing OpenAI API key');
        }

        // Format the search results as labeled references ([1], [2], etc.)
        const references = searchResults.map((r, index) => {
            return `${index + 1}. [Title: "${r.title}" - Link: "${r.link}"]\nSnippet: "${r.snippet}"\n`;
        });

        const prompt = `
      You are a helpful assistant.
      The user asked: "${query}"

      Here are the search results:
      ${references.join('\n')}

      Please provide a concise answer to the question, referencing the above sources with [1], [2], etc. where appropriate.
    `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openAIApiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // or 'gpt-4' if available
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate AI response');
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        return content || '';
    }, []);

    return { generateAiResponse };
};

export default useOpenAi;
