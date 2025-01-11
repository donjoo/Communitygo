import React from 'react';
import { usePayment } from '../../hooks/usePayment';

export const PaymentButton = ({
  amount,
  providerId,
  serviceType,
  serviceId,
  onSuccess,
  onError,
  className = '',
  disabled = false
}) => {
  const { initiatePayment, loading } = usePayment();

  const handleClick = () => {
    initiatePayment({
      amount,
      providerId,
      serviceType,
      serviceId,
      onSuccess,
      onError
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors
        ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
        text-white disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};