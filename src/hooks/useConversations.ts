import { useState } from 'react';
import { Conversation, ChatMessage } from '../types';

const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

    const startNewConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            messages: [],
            timestamp: Date.now(),
        };
        setCurrentConversation(newConversation);
        setConversations((prev) => [newConversation, ...prev]);
    };

    const addMessageToCurrentConversation = (message: ChatMessage) => {
        if (!currentConversation) return;
        const updatedConversation: Conversation = {
            ...currentConversation,
            messages: [...currentConversation.messages, message],
            timestamp: Date.now(),
        };
        setCurrentConversation(updatedConversation);
        setConversations((prev) =>
            prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
        );
    };

    const selectConversation = (conv: Conversation) => {
        setCurrentConversation(conv);
    };

    return { conversations, currentConversation, startNewConversation, addMessageToCurrentConversation, selectConversation };
};

export default useConversations;
