from django.shortcuts import render
from django.db import transaction, models
# Create your views here.
from rest_framework import viewsets, status
from decimal import Decimal
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import PlatformSettings, Transaction, MyEarnings, TransactionLog
import razorpay
from .serializers import TransactionSerializer,MyEarningsSerializer,TransactionLogSerializer
from Delivery.models import Delivery
from RideShare.models import Ride,RidePartner
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from users.models import CustomUser

class PaymentViewSet(viewsets.ViewSet):
    razorpay_client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)

    )

    def calculate_commision(self, amount):
        platform_settings = PlatformSettings.objects.first()
        commission_rate = platform_settings.commission_percentage / 100
        commission = Decimal(amount) * commission_rate
        provider_amount = Decimal(amount) - commission
        return commission, provider_amount

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        try:
            print('heloooooo payemtn')
            required_fields = ['amount', 'service_type', 'service_id']
            for field in required_fields:
                if field not in request.data:
                    raise ValueError(f"Missing required field: {field}")

            if not request.data['amount']:
                print('amount missing', request.data['amount'])
                raise ValueError("Amount cannot be empty")
            amount = int(float(request.data['amount']) * 100)
            commission, provider_amount = self.calculate_commision(amount/100)

            print('22')
            razorpay_order = self.razorpay_client.order.create({
                'amount': amount,
                'currency': 'INR',
                'payment_capture': 1,
                'notes': {
                    'service_type': request.data['service_type'],
                    'service_id': request.data['service_id']
                }
            })

            print(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            print(amount, provider_amount, commission)
            print(request.user)
            print(
                razorpay_order['id'], request.data['service_type'], request.data['service_id'])
            print('33')
            transaction = Transaction.objects.create(
                order_id=razorpay_order['id'],
                amount=amount/100,
                platform_commisson=commission,
                provider_amount=provider_amount,
                from_user=request.user,
                # to_user = request.data['provider_id'],
                service_type=request.data['service_type'],
                service_id=request.data['service_id']
            )

                

            service = request.data['service_type']
            service_id = request.data['service_id']
            try:
                if service == 'delivery':
                    delivery = Delivery.objects.get(id=service_id)
                    delivery.transaction = transaction
                    delivery.save()
                elif service == 'ride':
                    Partner = RidePartner.objects.get(id=service_id)
                    Partner.transaction = transaction
                    # Partner.amount = request.data['amount']
                    ride = Ride.objects.get(id = Partner.ride.id)
                    touser = CustomUser.objects.get(id = ride.user.id)
                    transaction.to_user = touser
                    transaction.save()
                    Partner.save()
                    # print(request.data['provider_id'],'provider idddd')
                    # touser = CustomUser.objects.get(id = request.data['provider_id'])
                    # print(touser,'touserrrrr')
                    # transaction.to_user = touser
                    # transaction.save()
                    # Partner = RidePartner.objects.get(id=service_id)
                    # Partner.transaction = transaction
                    # Partner.save()

                  
                else:
                    raise ValueError("Invalid service type provided.")
            except (Delivery.DoesNotExist, Ride.DoesNotExist) as e:
                print(f"Service with ID {service_id} does not exist: {e}")
            except Exception as e:
                print(f"An error occurred: {e}")

            print('44')
            print(settings.RAZORPAY_KEY_ID, '5')
            return Response({
                'id': razorpay_order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            print(str(e),'payment create order')
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
            transaction = Transaction.objects.get(
                order_id=request.data['order_id'])
            transaction.payment_id = request.data['payment_id']
            transaction.status = Transaction.COMPLETED
            transaction.save()

            TransactionLog.objects.create(  # Creates log, for havig transaction history
                user=transaction.from_user,
                transaction=transaction,
                action='debit',
                service=transaction.service_type,
                amount=transaction.amount
            )


            if transaction.service_type == 'delivery':
                    delivery = Delivery.objects.get(id=transaction.service_id)
                    delivery.payment_done = True
                    delivery.status = 'PENDING'
                    delivery.save()
            elif  transaction.service_type == 'ride':
                    partner = RidePartner.objects.get(id=transaction.service_id)
                    partner.payment_done = True
                    partner.status = 'pending'
                    partner.save()
            else:
                pass

            return Response({'status': 'Payment verified successfully'})
        except Exception as e:
            print(e)
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@action(detail=False, methods=['post'])
def transfer_to_provider(service_type=None, service_id=None):
    with transaction.atomic():
        print('transferinggg to walletttttt')
        try:
            print('1')
            print(service_id, service_type)
            payment = Transaction.objects.get(
                service_type=service_type,
                service_id=service_id,
                status=Transaction.COMPLETED
            )
            print('2')
            my_earnings, _ = MyEarnings.objects.get_or_create(
                user=payment.to_user
            )
            print('3')
            my_earnings.credit(payment.provider_amount)
            print('4')
            payment.status = Transaction.TRANSFERRED
            payment.save()

            print(my_earnings, '99')
            TransactionLog.objects.create(
                user=payment.to_user,
                earnings=my_earnings,
                action='credit',
                service=service_type,
                amount=payment.provider_amount
            )

            print('5')
            return {
            'status': 'success',
            'message': 'Payment transferred to provider wallet',
            'amount': payment.provider_amount,
        }

        except Transaction.DoesNotExist:
            return {
                'status': 'error',
                'message': 'No completed payment found for this service'
            }

        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

# @action(detail=False, methods=['get'])
# def transaction_history():
#     transactions = Transaction.objects.filter(
#         models.Q(from_user=request.user) |
#         models.Q(to_user=request.user)
#     ).order_by('-created_at')

#     serializer = TransactionSerializer(transactions, many=True)
#     return Response(serializer.data)


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


class Earnings(APIView):

   
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            earnings = MyEarnings.objects.get(user=request.user)
            logs = TransactionLog.objects.filter(user = request.user).order_by('-timestamp')
            earningsserializer = MyEarningsSerializer(earnings)
            logserializer  = TransactionLogSerializer(logs,many=True)
            
            data = {
                "earnings" :earningsserializer.data,
                'transactions':logserializer.data
            }

            return Response(data, status=200)
        except MyEarnings.DoesNotExist:
            return Response({"message": "No earnings data found."}, status=200)
        except TransactionLog.DoesNotExist:
            return Response({"message": "No transactions found."}, status=200)

