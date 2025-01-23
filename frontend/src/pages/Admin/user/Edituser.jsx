import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminAxiosInstance from '../../../adminaxiosconfig';
import AdminUserProfile from './profile';
import AdminDeliverylist from '../../../components/AdminComponents/userprofile/deliverylist';
import AdminCourierlist from '../../../components/AdminComponents/userprofile/courierlist';
import AdminRidelist from '../../../components/AdminComponents/userprofile/ridelist';
import AdminRideJoinedlist from '../../../components/AdminComponents/userprofile/joinedridelist';

const TABS = [
  { id: 'deliveries', label: 'Deliveries', component: AdminDeliverylist },
  { id: 'couriers', label: 'Couriers', component: AdminCourierlist },
  { id: 'rides', label: 'Rides', component: AdminRidelist },
  { id: 'joinedRides', label: 'Joined Rides', component: AdminRideJoinedlist },
];

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deliveries, setDeliveries] = useState(null);
  const [couriers, setCourier] = useState(null);
  const [rides, setRide] = useState(null);
  const [joinedRides, setJoined] = useState(null);
  const [activeTab, setActiveTab] = useState('deliveries');

  useEffect(() => {
    adminAxiosInstance
      .get(`userdetail/${id}/`)
      .then((response) => {
        setUser(response.data.user);
        setProfile(response.data.profile);
        setDeliveries(response.data.deliveries);
        setCourier(response.data.couriers);
        setRide(response.data.rides);
        setJoined(response.data.joined_rides);
      })
      .catch((error) => console.error(error));
  }, [id]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto py-8 px-4">
        <AdminUserProfile user={user} profile={profile} deliveries={deliveries} />

        {/* Tabs Navigation */}
        <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="p-4">
            {ActiveComponent && <ActiveComponent 
              deliveries={deliveries}
              couriers={couriers}
              rides={rides}
              joinedRides={joinedRides}
            />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetail;
