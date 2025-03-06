export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    searchResults?: SearchResult[];
}

export interface Conversation {
    id: string;
    messages: ChatMessage[];
    timestamp: number
}
