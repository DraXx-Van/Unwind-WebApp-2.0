import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authFetch } from '@/lib/api';

export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    createdAt?: string;
}

export interface Conversation {
    id: string;
    title: string;
    lastMessage?: string;
    totalMessages?: number;
    lastEmotion?: string;
    type: 'ai' | 'mentor';
    updatedAt: string;
    isPinned?: boolean;
}

interface ChatState {
    conversations: Conversation[];
    currentMessages: Message[];
    isLoading: boolean;
    isTyping: boolean;
    pinnedMentors: string[];

    // Actions
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendAiMessage: (conversationId: string, text: string) => Promise<void>;
    joinMentor: (code: string) => Promise<string | null>;
    startNewAiChat: (initialMessage: string) => Promise<string>;
    deleteConversation: (id: string) => void;
    togglePinConversation: (id: string) => void;
    togglePinMentor: (id: string) => void;
    clearCurrentMessages: () => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            currentMessages: [],
            isLoading: false,
            isTyping: false,
            pinnedMentors: [],

            fetchConversations: async () => {
                set({ isLoading: true });
                try {
                    const res = await authFetch('/ai/conversations');
                    if (res.ok) {
                        const data = await res.json();
                        const convs: Conversation[] = data.map((c: any) => ({
                            id: c.id,
                            title: c.title,
                            lastMessage: c.messages?.[0]?.content || '',
                            totalMessages: c._count?.messages || 0,
                            lastEmotion: 'Neutral',
                            type: 'ai',
                            updatedAt: c.updatedAt,
                        }));
                        set({ conversations: convs });
                    }
                } catch (e) {
                    console.error('Failed to fetch conversations', e);
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchMessages: async (conversationId: string) => {
                set({ isLoading: true, currentMessages: [] });
                try {
                    const res = await authFetch(`/ai/conversations/${conversationId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const msgs: Message[] = (data.messages || []).map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                            createdAt: m.createdAt,
                        }));
                        set({ currentMessages: msgs });
                    }
                } catch (e) {
                    console.error('Failed to fetch messages', e);
                } finally {
                    set({ isLoading: false });
                }
            },

            sendAiMessage: async (conversationId: string, text: string) => {
                // Optimistically add user message
                const userMsg: Message = {
                    id: 'temp-' + Date.now(),
                    role: 'user',
                    content: text,
                };
                set(state => ({
                    currentMessages: [...state.currentMessages, userMsg],
                    isTyping: true,
                }));

                try {
                    const res = await authFetch('/ai/chat', {
                        method: 'POST',
                        body: JSON.stringify({ conversationId, message: text }),
                    });

                    if (res.ok) {
                        const aiMsg = await res.json();
                        const aiMessage: Message = {
                            id: aiMsg.id,
                            role: 'model',
                            content: aiMsg.content,
                        };
                        set(state => ({
                            currentMessages: [...state.currentMessages, aiMessage],
                            isTyping: false,
                        }));

                        // Refresh conversations list to show updated title/timestamp
                        get().fetchConversations();
                    } else {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Failed to send message');
                    }
                } catch (e: any) {
                    console.error('Failed to send AI message', e);
                    const errorMsg: Message = {
                        id: 'error-' + Date.now(),
                        role: 'model',
                        content: e.message || 'Sorry, I am currently experiencing issues. Please try again.',
                    };
                    set(state => ({
                        currentMessages: [...state.currentMessages, errorMsg],
                        isTyping: false,
                    }));
                }
            },

            joinMentor: async (code) => {
                try {
                    const res = await authFetch('/mentor/code/join', {
                        method: 'POST',
                        body: JSON.stringify({ code })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        return data.mentor.id;
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            },

            startNewAiChat: async (initialMessage: string) => {
                const res = await authFetch('/ai/conversations', {
                    method: 'POST',
                    body: JSON.stringify({ title: initialMessage.slice(0, 30) }),
                });
                if (res.ok) {
                    const conv = await res.json();
                    const newConv: Conversation = {
                        id: conv.id,
                        title: conv.title,
                        type: 'ai',
                        updatedAt: conv.createdAt,
                    };
                    set(state => ({
                        conversations: [newConv, ...state.conversations]
                    }));
                    return conv.id;
                }
                // fallback
                return 'ai-' + Date.now();
            },

            deleteConversation: (id: string) => {
                set(state => ({
                    conversations: state.conversations.filter(c => c.id !== id)
                }));
                authFetch(`/ai/conversations/${id}`, { method: 'DELETE' }).catch(e => 
                    console.error('Failed to delete conversation from backend', e)
                );
            },

            togglePinConversation: (id: string) => {
                set(state => ({
                    conversations: state.conversations.map(c =>
                        c.id === id ? { ...c, isPinned: !c.isPinned } : c
                    )
                }));
            },

            togglePinMentor: (id: string) => {
                set(state => {
                    const isPinned = state.pinnedMentors.includes(id);
                    return {
                        pinnedMentors: isPinned
                            ? state.pinnedMentors.filter(mId => mId !== id)
                            : [...state.pinnedMentors, id]
                    };
                });
            },

            clearCurrentMessages: () => {
                set({ currentMessages: [] });
            },
        }),
        {
            name: 'unwind-chat-storage',
            partialize: (state) => ({
                conversations: state.conversations,
                pinnedMentors: state.pinnedMentors,
            }),
        }
    )
);
