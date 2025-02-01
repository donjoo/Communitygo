import { useState } from 'react';
import { paymentApi } from '../services/payment_api';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async ({
    amount,
    providerId,
    serviceType,
    serviceId,
    onSuccess,
    onError
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Create order
      const order = await paymentApi.createOrder({
        amount,
        provider_id: providerId,
        service_type: serviceType,
        service_id: serviceId
      });

      console.log('Order:', order);

      // Initialize Razorpay
      const options = {
        key: order.key,
        amount: order.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: `Payment for ${serviceType}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentApi.verifyPayment({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
            onSuccess && onSuccess(response);
          } catch (err) {
            onError && onError(err);
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message);
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
};