import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot' | 'mentor';
    timestamp: string;
    emotion?: string;
    dataUpdated?: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    totalMessages: number;
    lastEmotion: string;
    type: 'ai' | 'mentor';
    mentorCode?: string;
    updatedAt: string;
}

interface ChatState {
    conversations: Conversation[];
    currentMessages: Message[];
    isLoading: boolean;
    
    // Actions
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, text: string) => Promise<void>;
    joinMentor: (code: string) => Promise<boolean>;
    startNewAiChat: (initialMessage: string) => Promise<string>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            currentMessages: [],
            isLoading: false,

            fetchConversations: async () => {
                set({ isLoading: true });
                // Mocking for now, will link to real backend later
                const mockConvs: Conversation[] = [
                    {
                        id: 'ai-1',
                        title: 'Recent Breakup, felt s...',
                        lastMessage: 'I understand how you feel...',
                        totalMessages: 478,
                        lastEmotion: 'Sad',
                        type: 'ai',
                        updatedAt: new Date().toISOString(),
                    },
                    {
                        id: 'ai-2',
                        title: 'Shitty Teacher at Uni...',
                        lastMessage: 'That sounds frustrating...',
                        totalMessages: 478,
                        lastEmotion: 'Happy',
                        type: 'ai',
                        updatedAt: new Date(Date.now() - 86400000).toISOString(),
                    },
                    {
                        id: 'ai-3',
                        title: 'Just wanna stop exist...',
                        lastMessage: 'Please know that you matter...',
                        totalMessages: 478,
                        lastEmotion: 'Overjoyed',
                        type: 'ai',
                        updatedAt: new Date(Date.now() - 172800000).toISOString(),
                    },
                ];
                set({ conversations: mockConvs, isLoading: false });
            },

            fetchMessages: async (id) => {
                set({ isLoading: true });
                // Mock messages
                const mockMsgs: Message[] = [
                    {
                        id: '1',
                        text: "I can't believe this is happening! Everything is falling apart, and I feel so overwhelmed! F*** this world and everyone!",
                        sender: 'user',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        text: "Emotion: Anger, Despair. Data Updated.",
                        sender: 'bot',
                        timestamp: new Date().toISOString(),
                        emotion: 'Anger',
                        dataUpdated: true,
                    },
                    {
                        id: '3',
                        text: "Shinomiya, Let's work on coping strategies. You're not alone in this journey. I'm with you ALL THE WAY THROUGH!! 💯😊😊",
                        sender: 'bot',
                        timestamp: new Date().toISOString(),
                    }
                ];
                set({ currentMessages: mockMsgs, isLoading: false });
            },

            sendMessage: async (id, text) => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    text,
                    sender: 'user',
                    timestamp: new Date().toISOString(),
                };
                
                set(state => ({
                    currentMessages: [...state.currentMessages, newMessage]
                }));

                // Simulate AI Response
                setTimeout(() => {
                    const botMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "I'm processing what you said. Let's look at this together.",
                        sender: 'bot',
                        timestamp: new Date().toISOString(),
                    };
                    set(state => ({
                        currentMessages: [...state.currentMessages, botMsg]
                    }));
                }, 1000);
            },

            joinMentor: async (code) => {
                // Mock success
                return code === '123456';
            },

            startNewAiChat: async (initialMessage) => {
                const newId = 'ai-' + Date.now();
                const newConv: Conversation = {
                    id: newId,
                    title: initialMessage.slice(0, 25) + '...',
                    lastMessage: initialMessage,
                    totalMessages: 1,
                    lastEmotion: 'Neutral',
                    type: 'ai',
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({
                    conversations: [newConv, ...state.conversations]
                }));
                return newId;
            },
        }),
        {
            name: 'unwind-chat-storage',
            partialize: (state) => ({ conversations: state.conversations }),
        }
    )
);
