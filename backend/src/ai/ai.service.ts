import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are UnwindAI, a warm, empathetic, and non-judgmental mental health support companion built into the Unwind app. Your role is to:

- Listen actively and make the user feel heard and understood
- Offer emotional support, coping strategies, and gentle guidance
- Be conversational, warm, and human — never clinical or robotic
- Ask thoughtful follow-up questions to better understand the user's feelings
- Gently suggest professional help when the situation seems serious (self-harm, crisis, severe depression)
- NEVER diagnose, prescribe medication, or claim to be a therapist
- Keep responses concise (2-4 sentences max unless the user needs more) and natural
- Use the user's name when you know it to make it personal
- You are NOT Doctor Freud. You are UnwindAI.`;

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;

    constructor(private prisma: PrismaService) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    }

    async getConversations(userId: string) {
        return this.prisma.aiConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: { messages: true }
                }
            },
        });
    }

    async getConversation(conversationId: string, userId: string) {
        return this.prisma.aiConversation.findFirst({
            where: { id: conversationId, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }

    async createConversation(userId: string, title?: string) {
        return this.prisma.aiConversation.create({
            data: {
                userId,
                title: title || 'New Conversation',
            },
        });
    }

    async deleteConversation(conversationId: string, userId: string) {
        const conversation = await this.prisma.aiConversation.findFirst({
            where: { id: conversationId, userId }
        });

        if (!conversation) {
            throw new InternalServerErrorException('Conversation not found');
        }

        return this.prisma.aiConversation.delete({
            where: { id: conversationId }
        });
    }

    async sendMessage(userId: string, conversationId: string, userText: string, userName?: string) {
        try {
            // Load conversation history for context
            const history = await this.prisma.aiMessage.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'asc' },
                take: 20, // last 20 messages for context window
            });

            // Save the user's message first
            await this.prisma.aiMessage.create({
                data: { conversationId, role: 'user', content: userText },
            });

            // Build Gemini chat history
            const geminiHistory = history.map(msg => ({
                role: msg.role as 'user' | 'model',
                parts: [{ text: msg.content }],
            }));

            // Initialize Gemini model
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: userName
                    ? `${SYSTEM_PROMPT}\n\nThe user's name is ${userName}.`
                    : SYSTEM_PROMPT,
            });

            const chat = model.startChat({ history: geminiHistory });
            const result = await chat.sendMessage(userText);
            const aiText = result.response.text();

            // Save AI response
            const aiMessage = await this.prisma.aiMessage.create({
                data: { conversationId, role: 'model', content: aiText },
            });

            // Update conversation title if it's the first message
            if (history.length === 0) {
                const shortTitle = userText.length > 30 ? userText.slice(0, 30) + '...' : userText;
                await this.prisma.aiConversation.update({
                    where: { id: conversationId },
                    data: { title: shortTitle, updatedAt: new Date() },
                });
            } else {
                await this.prisma.aiConversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() },
                });
            }

            return { role: 'model', content: aiText, id: aiMessage.id };
        } catch (error: any) {
            console.error('Gemini AI error:', error);
            const isHighDemand = error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand');
            const errorMessage = isHighDemand 
                ? 'Sorry, I am currently experiencing high demand and could not process your message. Please try again later.'
                : 'AI service is temporarily unavailable. Please try again.';
            throw new InternalServerErrorException(errorMessage);
        }
    }
}
