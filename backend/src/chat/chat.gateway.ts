import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private chatService: ChatService,
        private jwtService: JwtService
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('Unauthorized');
            
            const payload = await this.jwtService.verifyAsync(token);
            client.data.user = payload; // { sub: id, email, role? }
        } catch (e) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Disconnect logic if needed
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { studentId: string, mentorId: string }, @ConnectedSocket() client: Socket) {
        const roomName = `room_${data.studentId}_${data.mentorId}`;
        client.join(roomName);
        return { event: 'joinedRoom', data: roomName };
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: { studentId: string, mentorId: string, content: string }, @ConnectedSocket() client: Socket) {
        const role = client.data.user?.role === 'mentor' ? 'mentor' : 'student';
        
        // Save to DB
        const savedMessage = await this.chatService.saveMessage({
            content: data.content,
            senderType: role,
            studentId: data.studentId,
            mentorId: data.mentorId,
        });

        // Broadcast to the room
        const roomName = `room_${data.studentId}_${data.mentorId}`;
        this.server.to(roomName).emit('newMessage', savedMessage);
        
        return savedMessage;
    }
}
