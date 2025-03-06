import { useState, useEffect } from 'react';
import { Conversation, ChatMessage } from '../types';

const LOCAL_STORAGE_CONVERSATIONS_KEY = 'conversations';
const LOCAL_STORAGE_CURRENT_CONVERSATION_KEY = 'currentConversation';

const loadConversationsFromStorage = (): Conversation[] => {
    const stored = localStorage.getItem(LOCAL_STORAGE_CONVERSATIONS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored) as Conversation[];
        } catch (error) {
            console.error('Error parsing stored conversations:', error);
        }
    }
    return [];
};

const loadCurrentConversationFromStorage = (): Conversation | null => {
    const stored = localStorage.getItem(LOCAL_STORAGE_CURRENT_CONVERSATION_KEY);
    if (stored) {
        try {
            return JSON.parse(stored) as Conversation;
        } catch (error) {
            console.error('Error parsing stored current conversation:', error);
        }
    }
    return null;
};

const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>(() =>
        loadConversationsFromStorage()
    );
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(() =>
        loadCurrentConversationFromStorage()
    );

    // Save conversations to localStorage when they change.
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
    }, [conversations]);

    // Save the current conversation to localStorage when it changes.
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_CURRENT_CONVERSATION_KEY, JSON.stringify(currentConversation));
    }, [currentConversation]);

    const startNewConversation = (): Conversation => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            messages: [],
            timestamp: Date.now(),
        };
        setCurrentConversation(newConversation);
        setConversations((prev) => [newConversation, ...prev]);
        return newConversation;
    };

    // sendMessage: if no conversation exists, create one with the message;
    // otherwise, append the message to the current conversation.
    const sendMessage = (message: ChatMessage) => {
        setCurrentConversation((prevConv) => {
            if (!prevConv) {
                const newConversation: Conversation = {
                    id: Date.now().toString(),
                    messages: [message],
                    timestamp: Date.now(),
                };
                setConversations((prevConvs) => [newConversation, ...prevConvs]);
                return newConversation;
            } else {
                const updatedConversation: Conversation = {
                    ...prevConv,
                    messages: [...prevConv.messages, message],
                    timestamp: Date.now(),
                };
                setConversations((prevConvs) =>
                    prevConvs.map((c) => (c.id === updatedConversation.id ? updatedConversation : c))
                );
                return updatedConversation;
            }
        });
    };

    const selectConversation = (conv: Conversation) => {
        setCurrentConversation(conv);
    };

    return { conversations, currentConversation, sendMessage, selectConversation, startNewConversation };
};

export default useConversations;
