from django.db import models
from users.models import CustomUser
# Create your models here.





class Room(models.Model):
    room_name = models.CharField(max_length=255,null=True)

    def __str(self):
        return self.room_name
    

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE,null=True)
    sender = models.ForeignKey(CustomUser,related_name='sent_message', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser,related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}: {self.content}"
    





