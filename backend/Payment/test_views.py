# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase
# from .models import Transaction, Wallet, CustomUser  # Import your models

# class PaymentViewSetTests(APITestCase):
    
#     def setUp(self):
#         # Create a user
#         self.user = CustomUser.objects.get(username='kevin')
        
#         # Create a transaction
#         self.transaction = Transaction.objects.get(
#             service_type='delivery',
#             service_id=19)
           
#         # Create a wallet for the user
#         self.wallet = Wallet.objects.create(user=self.user)

#     def test_transfer_to_provider(self):
#         # Log in the user
#         self.client.login(username='kevin', password='Kevin@gmail.com')

#         # Define the URL for the transfer_to_provider action
#         url = reverse('courier_completed', args=[self.delivery.id]) # Make sure this matches your URL configuration

#         # Prepare the data for the request
#         data = {
#             'service_type': 'delivery',
#             'service_id': self.transaction.service_id,
#         }

#         # Make the POST request to the endpoint
#         response = self.client.post(url, data)

#         # Assert that the response is successful
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         # Check that the wallet amount has been updated correctly
#         self.wallet.refresh_from_db()
#         self.assertEqual(self.wallet.balance, 100.00)  # Assuming balance is updated correctly

#         # Check that the payment status has been updated
#         self.transaction.refresh_from_db()
#         self.assertEqual(self.transaction.status, Transaction.TRANSFERRED)

#     # def tearDown(self):
#     #     # Clean up any created objects if necessary (optional)
#     #     self.user.delete()
