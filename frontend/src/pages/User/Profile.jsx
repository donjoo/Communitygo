import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import api from '../../api';
import UserProfile from '../../components/common/UserProfile';
import Deliverylist from '../../components/common/Deliverylist';
import Navbar from '../../components/Navbar';
import Courierlist from '../../components/common/Courierlist';
import Footer from '../../components/Footer';
import Ridelist from '../../components/common/Ridelist';
import MyJoinlist from '../../components/common/Ride/MyJoinlist';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState();
  const [deliveries, setDeliveries] = useState(null);
  const [couriers, setCouriers] = useState(null);
  const [rides, setRides] = useState(null);
  const [joins, setJoins] = useState(null);
  const [activeTab, setActiveTab] = useState('Deliveries'); // Track the active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchprofile = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log('Latitude: ' + latitude + ', Longitude: ' + longitude);
      });

      try {
        const response = await api.get(`/profile`);
        if (response.status === 200) {
          setUser(response.data.user);
          setProfile(response.data.profile);
          setDeliveries(response.data.deliveries);
          setCouriers(response.data.couriers);
          setRides(response.data.rides);
          setJoins(response.data.partner);
        } else {
          setError('Error occurred while fetching user profile');
        }
      } catch (error) {
        console.log('An unexpected error occurred');
      }
    };

    fetchprofile();
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  const handlemailverify = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('resend_otp/', {
        email: user.email,
      });
      if (response.status >= 200 && response.status < 300) {
        navigate('/verifyotp', {
          state: { email: user.email },
        });
      }
    } catch (error) {
      console.log('Email verification failed');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Deliveries':
        return deliveries?.length > 0 ? (
          <Deliverylist deliveries={deliveries} />
        ) : (
          <p className="text-center text-gray-600 font-semibold py-4">
            You haven't requested any deliveries yet.
          </p>
        );
      case 'Couriers':
        return couriers?.length > 0 ? (
          <Courierlist couriers={couriers} />
        ) : (
          <p className="text-center text-gray-600 font-semibold py-4">
            You haven't been a courier.
          </p>
        );
      case 'Rides':
        return rides?.length > 0 ? (
          <Ridelist rides={rides} />
        ) : (
          <p className="text-center text-gray-600 font-semibold py-4">
            You haven't had any rides yet.
          </p>
        );
      case 'My Joins':
        return joins?.length > 0 ? (
          <MyJoinlist joins={joins} />
        ) : (
          <p className="text-center text-gray-600 font-semibold py-4">
            You haven't joined any rides yet.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <UserProfile user={user} profile={profile} deliveries={deliveries} />

      {!user.email_verified && (
        <div className="mt-4 text-left pl-4">
          <p className="text-gray-600 font-semibold py-4">
            Your email is not verified, verify to use our services.
          </p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
            onClick={handlemailverify}
          >
            Verify Email
          </button>
        </div>
      )}

      <div className="mt-10">
        {/* Tab Navigation */}
        <div className="flex justify-around bg-orange-600 text-white rounded-t-lg">
          {['Deliveries', 'Couriers', 'Rides', 'My Joins'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 ${
                activeTab === tab ? 'bg-orange-700' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow-md rounded-b-lg p-4">
          {renderActiveTab()}
        </div>
      </div>

      <Footer />
    </>
  );
}
