import React, { useEffect, useState } from 'react';
import api from '../../api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../component/ui/table';
import { toast } from 'sonner';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    accountNumber: '',
    amount: '',
  });
  const [amountError, setAmountError] = useState('');

  const fetchEarningsAndTransactions = async () => {
    try {
      const Response = await api.get('payments/my_earnings/');
      if (Response.data.message) {
        setEarnings(null); // Reset earnings data if no earnings found
        setTransactions([]); // Reset transactions if none found
        setError(Response.data.message);
      }else {
      setEarnings(Response.data.earnings);
      setTransactions(Response.data.transactions);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsAndTransactions();
  }, []);

  const handleWithdrawClick = () => {
    setShowWithdrawForm((prev) => !prev); // Toggle the form
    setWithdrawData({ accountNumber: '', amount: '' }); // Reset form data
    setAmountError(''); // Clear any existing error
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { amount } = withdrawData;
    if (amount <= 0 || amount > earnings.earnings) {
      setAmountError(
        'Invalid amount! Please enter a positive amount within the limit.'
      );
      return;
    }
    try {
      const response = await api.post('payments/withdraw/', withdrawData);
      // alert(response.data.message || 'Withdrawal successful!');
      toast.success(response.data.message || 'Withdrawal successful!');
      setWithdrawData({ accountNumber: '', amount: '' });
      setShowWithdrawForm(false);
      fetchEarningsAndTransactions(); // Refresh earnings
    } catch (error) {
      // alert('Withdrawal failed. Please try again.');
      toast.error('Withdrawal failed. Please try again.');
    }
  };






   const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 6; // Number of deliveries per page
  
  
    // Calculate total pages
    const totalPages = Math.ceil(transactions.length / logsPerPage);
  
    // Get the current page's deliveries
    const startIndex = (currentPage - 1) * logsPerPage;
    const currenttransactions = transactions.slice(startIndex, startIndex + logsPerPage);
  
    // Handle page change
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };


    
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Earnings</h1>

        {earnings ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold">
              Total Earnings: ₹{earnings.total_earnings || 0}
            </h2>
            <h3 className="text-lg">
              Withdrawable Amount: ₹{earnings.earnings || 0}
            </h3>
            {earnings.earnings > 0 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={handleWithdrawClick}
              >
                {showWithdrawForm ? 'Close Form' : 'Withdraw'}
              </button>
            )}
          </div>
        ) : (
          <p>No earnings found.</p>
        )}

        {showWithdrawForm && (
          <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Withdraw Form</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={withdrawData.accountNumber}
                  onChange={(e) =>
                    setWithdrawData({
                      ...withdrawData,
                      accountNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (Limit: ₹{earnings.earnings || 0})
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={withdrawData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWithdrawData({
                      ...withdrawData,
                      amount: value,
                    });
                    setAmountError(''); // Clear error on valid input
                  }}
                  min="1"
                  max={earnings.earnings}
                  required
                />
                {amountError && (
                  <p className="text-red-500 text-sm mt-1">{amountError}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => setShowWithdrawForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <Table className="table-auto border border-gray-200 shadow-lg w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] p-4 text-left">Order ID</TableHead>
                <TableHead className="w-[150px] p-4 text-left">Amount</TableHead>
                <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
                <TableHead className="w-[150px] p-4 text-left">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.length > 0 ? (
                currenttransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="p-4 text-gray-700">
                      {transaction.service}
                    </TableCell>
                    <TableCell className="p-4 text-gray-700">
                      ₹{transaction.amount}
                    </TableCell>
                    <TableCell className="p-4 text-gray-700">
                      {transaction.action}
                    </TableCell>
                    <TableCell className="p-4 text-gray-700">
                      {transaction.timestamp
                        ? new Date(transaction.timestamp).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No transactions found.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>



           {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Next
        </button>
      </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Earnings;
