import React, { useState, useEffect } from 'react';
import { paymentApi } from '../services/api';

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await paymentApi.getTransactions(page);
      setTransactions(prev => [...prev, ...data.results]);
      setHasMore(data.next !== null);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {loading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {transaction.service_type.charAt(0).toUpperCase() + 
                       transaction.service_type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{transaction.amount}</p>
                    <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + 
                       transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
                {transaction.platform_commission && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Platform Fee: ₹{transaction.platform_commission}</p>
                    <p>Provider Amount: ₹{transaction.provider_amount}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {hasMore && !loading && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="mt-4 w-full py-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};
