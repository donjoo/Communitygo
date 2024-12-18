from django.db import models
from users.models import CustomUser
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point



class Addresses(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='address',default=1)
    address_line_1 = models.CharField(max_length=225)
    address_line_2 = models.CharField(max_length=225,blank=True,null=True)
    city           = models.CharField(max_length=50)
    state          = models.CharField(max_length=50)
    postal_code    = models.CharField(max_length=20)
    country        = models.CharField(max_length=100,default='India')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    point = gis_models.PointField(geography=True, srid=4326, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Automatically set the PointField if latitude and longitude are provided
        if self.latitude and self.longitude:
            self.point = Point(self.longitude, self.latitude)
        super().save(*args, **kwargs)



    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state} - {self.postal_code}"
    
# class Courier(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courier_deliveries')
#     # other courier-specific fields

#     def __str__(self):
#         return f"Courier: {self.user.username}"


class Delivery(models.Model):

    DELIVERY_STATUS = [
        ('PENDING', 'Pending'),
        ('ASSIGNED','Assigned'),
        ('PICKED_UP', 'Picked Up'),
        ('DELIVERED', 'Delivered'),
        ('CANCELED', 'Canceled'),   
    ]

    PACKAGE_SIZES = [
        ('SM','Small'),
        ('MD','Medium'),
        ('LG','Large'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='deliveries')
    from_address = models.ForeignKey(Addresses, on_delete=models.CASCADE, related_name='from_deliveries')
    to_address  = models.ForeignKey(Addresses, on_delete=models.CASCADE, related_name='to_deliveries')
    package_size = models.CharField(max_length=12, choices=PACKAGE_SIZES)
    # courier     = models.ForeignKey(Courier, on_delete=models.SET_NULL, null=True,blank=True, related_name='assigned_deliveries')
    courier     = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True,blank=True, related_name='assigned_courier',default=None)
    status = models.CharField(max_length=12, choices=DELIVERY_STATUS, default='PENDING')
    pickup_otp = models.CharField(max_length=4,null=True, blank=True)
    dropoff_otp = models.CharField(max_length=4,null=True,blank=True)
    delivered_at = models.DateTimeField(null=True,blank=True)
    picked_upat = models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_completed = models.BooleanField(default=False)
    is_pickedup = models.BooleanField(default=False)


    def __str__(self):
        return f"Delivery {self.id} | User: {self.user.username} | Courier: {self.courier.username if self.courier else 'Unassigned'}"
    

class Courier(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courier_deliveries',default=None)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='performance',default=None,null=True,blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    rating = models.FloatField(default=0.0)
    feedback = models.CharField(null=True,blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Delivery {self.delivery.id} | Amount: ${self.amount} | Rating: {self.rating}"











