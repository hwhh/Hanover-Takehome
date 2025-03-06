import {useCallback} from 'react';
import {SearchResult} from '../components/SearchResults';


const useSerpAPI = () => {
    const searchGoogle = useCallback(async (query: string): Promise<SearchResult[]> => {
        const serpApiKey = import.meta.env.VITE_SERP_API_KEY;
        if (!serpApiKey) {
            throw new Error('Missing SerpAPI key in environment variables');
        }
        const encodedQuery = encodeURIComponent(query);

        const url = `/api/search.json?api_key=${serpApiKey}&q=${encodedQuery}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch search results from SerpAPI');
        }
        const data = await response.json();
        return data.organic_results?.map((r: any) => ({
            title: r.title,
            link: r.link,
            snippet: r.snippet,
        })) || [];
    }, []);

    return { searchGoogle };
};

export default useSerpAPI;
