# # chat/consumers.py
# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()

#     async def disconnect(self, close_code):
#         pass

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         # Echo the received message back to the client
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))


# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json['message']
        user = self.scope['user']  # Assuming you have authentication setup

        # Save the message to the database
        message = Message.objects.create(user=user, content=message_text)

        # Broadcast the received message to all clients
        await self.channel_layer.group_send(
            'chat_group',  # Name of the group
            {
                'type': 'chat_message',
                'message': message_text,
                'sender': user.username
            }
        )

    async def chat_message(self, event):
        # Send the received message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))
