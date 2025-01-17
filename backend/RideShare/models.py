from django.db import models
from users.models import CustomUser
from Payment.models import Transaction

# Create your models here.






    

class RideRoute(models.Model):
    starting_point = models.CharField(max_length=225)
    endpoint = models.CharField(max_length=225)
    start_latitude = models.FloatField(null=True, blank=True)
    start_longitude = models.FloatField(null=True, blank=True)
    
    # Coordinates for the endpoint
    end_latitude = models.FloatField(null=True, blank=True)
    end_longitude = models.FloatField(null=True, blank=True)

    
    def __str__(self):
        return f"{self.starting_point} , {self.endpoint}"

class Ride(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='rides')
    route = models.ForeignKey(RideRoute, on_delete=models.CASCADE,related_name='ride')
    vehicle = models.CharField(max_length=225)
    total_seats = models.PositiveIntegerField(null=True,blank=True)
    available_seats = models.PositiveIntegerField(null=True,blank=True)
    date = models.DateField(null=True,blank=True)
    starting_time = models.TimeField(null=True,blank=True)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending')    
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=10,decimal_places=2,null=True)  # total amount from this ride.





    def __str__(self):
        return f"Ride by {self.user} on route from {self.route.starting_point} to {self.route.endpoint}"



class RidePartner(models.Model):
    STATUS_CHOICES = [
        ('payment','Payment'),
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('pickedup','Pickedup'),
        ('dropedoff','Dropedoff'),
        ('cancled','Cancled'),
    ]
     
    ride = models.ForeignKey(Ride,on_delete=models.CASCADE, related_name='partners')
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='ride_joined')
    seats = models.PositiveIntegerField(null=True,blank=True)
    pickup = models.CharField(max_length=225)
    dropoff = models.CharField(max_length=225)
    pickup_latitude = models.FloatField(null=True,blank=True)
    pickup_longitude = models.FloatField(null=True,blank=True)
    dropoff_latitude = models.FloatField(null=True,blank=True)
    dropoff_longitude = models.FloatField(null=True,blank=True)
    is_pickedup = models.BooleanField(default=False)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='payment')
    distance = models.FloatField(null=True, blank=True) 
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2,null=True)
    rating = models.FloatField(default=0.0)
    feedback = models.CharField(null=True,blank=True)
    payment_done = models.BooleanField(default=False)





    def __str__(self):
        return f"{self.pickup}, {self.dropoff}"