import json,logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
import jwt

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def initialize_chat(self, user_id, receiver_username):
        from users.models import CustomUser
        from .models import Message, Room
        
        try:
            user = CustomUser.objects.get(id=user_id)
            room_name = f"{min(user.username, receiver_username)}_{max(user.username, receiver_username)}"
            room, _ = Room.objects.get_or_create(room_name=room_name)
            messages = list(Message.objects.select_related('sender', 'receiver').filter(room=room).order_by('timestamp'))
            return user, room, messages
        except Exception as e:
            return None, None, []

    @database_sync_to_async
    def format_message(self, message):
        return {
            'message': message.content,
            'sender': message.sender.username,
            'timestamp': message.timestamp.isoformat()
        }

    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            payload = jwt.decode(token, 'django-insecure-6$b!p3q0w)z=tzk8=1y&b9w^slq90^0mm9#2xl87ze3$)_a-zd', algorithms=['HS256'])
            
            self.receiver_username = self.scope['url_route']['kwargs']['receiver_username']
            self.user, self.room, messages = await self.initialize_chat(payload['user_id'], self.receiver_username)
            
            if not self.user or not self.room:
                await self.close()
                return

            self.sender = self.user
            self.room_group_name = f"chat_{self.room.room_name}"

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            for message in messages:
                formatted_message = await self.format_message(message)
                await self.send(text_data=json.dumps(formatted_message))

        except Exception as e:
            await self.close()

    @database_sync_to_async
    def save_message(self, content):
        from users.models import CustomUser
        from .models import Message
        try:
            receiver = CustomUser.objects.get(username=self.receiver_username)
            return Message.objects.create(
                room=self.room,
                sender=self.sender,
                receiver=receiver,
                content=content
            )
        except Exception as e:
            print(f"Save error: {str(e)}")
            return None

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = await self.save_message(data['message'])
            if message:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message.content,
                        'sender': message.sender.username,
                        'timestamp': message.timestamp.isoformat()
                    }
                )
        except Exception as e:
            print(f"Receive error: {str(e)}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))