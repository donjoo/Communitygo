import React, { useEffect, useState } from 'react';
import { paymentApi } from '../services/api';

export const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await paymentApi.getWalletBalance();
        setBalance(data.balance);
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"/>
      ) : (
        <p className="text-3xl font-bold text-blue-600">
          ₹{balance.toFixed(2)}
        </p>
      )}
    </div>
  );
};