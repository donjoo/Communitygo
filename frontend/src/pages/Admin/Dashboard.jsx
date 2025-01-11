import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminComponents/AdminNavbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Package, Users, Car, TrendingUp } from 'lucide-react';
import adminAxiosInstance from '../../adminaxiosconfig';

function Dashboard() {
  const [registrationData, setRegistrationData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [rideData, setRideData] = useState([]);
  const [packageSizeData, setPackageSizeData] = useState([]);
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]); // Initialize as an empty array
  const [ongoingRides, setOngoingRides] = useState([]); // Initialize as an empty array
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];


  const fetchDashboardData = async () => {
    try {
      const response = await adminAxiosInstance.get('dashboard/data/');
      if (response.status === 200) {
        setRegistrationData(response.data.registration_data);
        setDeliveryData(response.data.delivery_data);
        setRideData(response.data.ride_data);
        setPackageSizeData(response.data.package_size_data);
        setOngoingDeliveries(response.data.ongoing_deliveries); // Correct assignment
        setOngoingRides(response.data.ongoing_rides); // Correct assignment
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your platform's performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Add your stats cards here */}
          {/* Example for Total Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="h-12 w-12 text-blue-500" />
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.total_users || 0}</h3>
              </div>
            </div>
          </div>
          {/* Repeat for other stats */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Registrations Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">User Registrations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0088FE" />
                <Line type="monotone" dataKey="drivers" stroke="#00C49F" />
                <Line type="monotone" dataKey="couriers" stroke="#FFBB28" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Delivery Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#0088FE" />
                <Bar dataKey="cancelled" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ride Statistics Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ride Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rideData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rides" stroke="#8884d8" />
                <Line type="monotone" dataKey="bookings" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Package Size Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Package Size Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageSizeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {packageSizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ongoing Activities */}
        {/* Ongoing Deliveries Table */}
        {/* Ongoing Rides Table */}
      </div>
    </>
  );
}

export default Dashboard;
