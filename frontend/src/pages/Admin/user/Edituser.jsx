import { Link, NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import adminAxiosInstance from '../../../adminaxiosconfig';
import AdminNavbar from '../../../components/AdminComponents/AdminNavbar';
import Deliverylist from '../../../components/common/Deliverylist';
import UserProfile from '../../../components/common/UserProfile';
import Courierlist from '../../../components/common/Courierlist';



const UserDetail = () => {



  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState(null)
  const [couriers,setCourier] = useState(null)


  useEffect(() => {
    adminAxiosInstance.get(`userdetail/${id}/`)
      .then((response) => {
        // console.log(response.data.deliveries)
        console.log(response.data.couriers)

        setUser(response.data.user);
        setDeliveries(response.data.deliveries);
        setCourier(response.data.couriers)
      })
      .catch((error) => console.error(error));

  }, [id]);



  if (!user) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    ); // Show loading message if user data is null
  }



  return (

    <>

      < AdminNavbar />


      <body class="bg-white text-black font-sans">
        <main class="container mx-auto py-8">
          < UserProfile   user={user} deliveries={deliveries}/>

          <section class="mt=10 ">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              Requested Deliveries
            </h1>
            < Deliverylist deliveries={deliveries} />

            < Courierlist couriers={couriers} />
          </section>


        </main>



      </body>

    </>

  )
};

export default UserDetail