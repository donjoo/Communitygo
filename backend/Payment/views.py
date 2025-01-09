from django.shortcuts import render
from django.db import transaction,models
# Create your views here.
from rest_framework import viewsets, status
from decimal import Decimal
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import PlatformSettings,Transaction,Wallet
import razorpay
from .serializers import TransactionSerializer

class PaymentViewSet(viewsets.ViewSet):
    razorpay_client = razorpay.Client(
        auth = (settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET)

    )

    def calculate_commision(self,amount):
        platform_settings = PlatformSettings.objects.first()
        commission_rate = platform_settings.commission_percentage / 100
        commission = Decimal(amount) * commission_rate
        provider_amount = Decimal(amount) - commission
        return commission, provider_amount
    

    @action(detail=False,methods=['post'])
    def create_order(self,request):
        try :
            required_fields = ['amount', 'service_type', 'service_id']
            for field in required_fields:
                if field not in request.data:
                    raise ValueError(f"Missing required field: {field}")
        
            if not request.data['amount']:
                raise ValueError("Amount cannot be empty")
            amount = int(float(request.data['amount'])* 100)
            commission, provider_amount = self.calculate_commision(amount/100)

            print('22')
            razorpay_order = self.razorpay_client.order.create({
                'amount':amount,
                'currency':'INR',
                'payment_capture':1,
                'notes':{
                    'service_type': request.data['service_type'],
                    'service_id':request.data['service_id']
                }
            })


            print(amount,provider_amount,commission)
            print(request.user)
            print( razorpay_order['id'],request.data['service_type'],request.data['service_id'])
            print('33')
            transaction = Transaction.objects.create(
                order_id = razorpay_order['id'],
                amount = amount/100,
                platform_commisson = commission,
                provider_amount = provider_amount,
                from_user = request.user,
                # to_user = request.data['provider_id'],
                service_type = request.data['service_type'],
                service_id = request.data['service_id']
            )

            print('44')
            print(settings.RAZORPAY_KEY_ID,'5')
            return Response({
                'id':razorpay_order['id'],
                'amount':amount,
                'currency':'INR',
                'key':settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        try:
            params_dict = {
                'razorpay_payment_id': request.data['payment_id'],
                'razorpay_order_id': request.data['order_id'],
                'razorpay_signature': request.data['signature']
            }
            
            # Verify signature
            self.razorpay_client.utility.verify_payment_signature(params_dict)
            
            # Update transaction
            transaction = Transaction.objects.get(order_id=request.data['order_id'])
            transaction.payment_id = request.data['payment_id']
            transaction.status = Transaction.COMPLETED
            transaction.save()

            return Response({'status': 'Payment verified successfully'})
        except Exception as e:
            print(e)
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'])
    def transfer_to_provider(self,request):
        with transaction.atomic():
            try:
                payment = Transaction.objects.get(
                    service_type = request.data['service_type'],
                    service_id = request.data['service_id'],
                    status = Transaction.COMPLETED
                )


                provider_wallet, _ = Wallet.objects.get_or_create(
                    user = payment.to_user
                )


                provider_wallet.credit(payment.provider_amount)

                payment.status = Transaction.TRANSFERRED
                payment.save()



                return Response({
                    'status':'success',
                    'message':'Payment transfered to provider wallet',
                    'amount':payment.provider_amount,
                })
            
            except Transaction.DoesNotExist:
                return Response({
                    'status':'error',
                    'message':'No completed payment found for this service'
                },status=400)
            
            except Exception as e:
                return Response({
                    'status':'error',
                    'message':str(e)
                },status = 400)
            
    @action(detail=False, methods=['get'])
    def transaction_history(self, request):
        transactions = Transaction.objects.filter(
            models.Q(from_user=request.user) | 
            models.Q(to_user=request.user)
        ).order_by('-created_at')
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
            



# For delivery completion
@action(detail=False, methods=['post'])
def complete_delivery(self, request):
    """Called when delivery is completed"""
    delivery_id = request.data['delivery_id']
    
    try:
        # Verify delivery completion logic here
        
        # Transfer payment to courier's wallet
        return self.transfer_to_provider(request)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=400)

# For ride completion
@action(detail=False, methods=['post'])
def complete_ride(self, request):
    """Called when ride is completed"""
    ride_id = request.data['ride_id']
    
    try:
        # Verify ride completion logic here
        
        # Transfer payment to driver's wallet
        return self.transfer_to_provider(request)
    
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=400)