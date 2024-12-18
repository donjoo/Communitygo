import React, { useEffect } from 'react'
import { useState } from 'react'


import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import adminAxiosInstance from '../../adminaxiosconfig'
import { useDispatch, useSelector } from 'react-redux'
import AdminNavbar from '../../components/AdminComponents/AdminNavbar'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthData } from '../../redux/auth/authSlice';



  
function Usermanagement() {

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
    const [editingUser, setEditingUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error,setError]    = useState(null);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    const totalPages = Math.ceil(users.length / usersPerPage);

    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = users.slice(startIndex,startIndex + usersPerPage)
 
    const handlePageChange = (page) => {
      if (page >=1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }

    useEffect(() => {
      if (!user) {
        const storedUserData = localStorage.getItem('adminData');
        if (storedUserData) {
          const parsedAdminData = JSON.parse(storedUserData);
          if (parsedAdminData?.user) {
            dispatch(setAuthData({ user: parsedAdminData.user})); // Dispatch user data to the Redux store
          }
        }
      }
    }, [dispatch, navigate, user]);


    const fetchUserlist = async () => {
        try {
            const response = await adminAxiosInstance.get('/admin/userlist/');

            if (response.data){
                setUsers(response.data.users); 
            } else {
                setError('No users found.');
            }
        }catch (error){
            console.error('Error fetching userlist')
        }
    };

    
    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus ? 'block' : 'unblock';
            // const response = await adminAxiosInstance.post(`admin/${userId}/toggle_status/`);
            const response = await adminAxiosInstance.post(`${userId}/toggle_status/`);

            if (response.data.success) {
                alert(`User successfully ${newStatus}ed!`);
                fetchUserlist();
            } else {
                alert(`Failed to ${newStatus} the user.`);
            }
        } catch (error) {
            console.error(`Failed to toggle user status for user ID ${userId}:`, error);
            alert('An error occurred while updating user status.');
        }
    };
    

    const deleteUser = async (userId) =>{
      try {
        const response = await adminAxiosInstance.post(`${userId}/delete_user/`);

        if (response.data.success) {
          alert(`User successfully deleted!`);
          fetchUserlist();
        } else {
          alert(`Failed to delete user.`);
        }
      } catch (error) {
        console.error(`Failed to delete user of user id ${userId}:`,error);
        alert('An error occured while updataing user status');
      }
    };

    
    useEffect(() => {
        fetchUserlist()
    },[])


    const addUser = async (e) => {
      e.preventDefault();
    
      // Input validation
      if (!newUser.first_name|| !newUser.last_name || !newUser.phone_number || !newUser.name || !newUser.email || !newUser.password) {
        alert('Please fill in all fields');
        return;
      }
    
      // Check if email is valid
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(newUser.email)) {
        alert('Please enter a valid email address');
        return;
      }


      const payload = {
        first_name:newUser.first_name,
        last_name:newUser.last_name,  
        username:newUser.name,
        phone_number:newUser.phone_number,
        email:newUser.email,
        password:newUser.password,
      }

      const response = await adminAxiosInstance.post('create_user/',payload);
      if (response.status === 200){

        fetchUserlist()
     
      }
    
      
    };
  
   


    
  
    const updateUser = (e) => {
      e.preventDefault()
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user))
      setEditingUser(null)
      setIsModalOpen(false)
    }
  
    const openEditModal = (user) => {
      setEditingUser(user)
      setIsModalOpen(true)
    }
  

  return (
   <>
   < AdminNavbar />
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">User Management</h1>
    
    <form onSubmit={addUser} className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="flex flex-wrap gap-4">

        <input
            type="text"
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

<input
            type="text"
            placeholder="last Name"
            value={newUser.last_name}
            onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

         
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <input
            type="text"
            placeholder="Phone number"
            value={newUser.phone_number}
            onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
         
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusIcon className="inline-block mr-2 h-4 w-4" /> Add User
          </button>
        </div>
      </form>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} >
               {/* <Link to={`/user/${user.id}`} className="text-blue-600 hover:underline"> */}
                        
              <td  onClick={() => navigate(`/user/${user.id}`)} className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
              <td  onClick={() => navigate(`/user/${user.id}`)} className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
              {/* </Link> */}
              <td className="px-6 py-4 whitespace-nowrap">
             
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <button
    onClick={() => toggleUserStatus(user.id, user.is_active)}
    className={`p-1 ${
        user.is_active ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
    } rounded-md hover:${
        user.is_active ? 'bg-red-200' : 'bg-green-200'
    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        user.is_active ? 'focus:ring-red-500' : 'focus:ring-green-500'
    }`}
>
    {user.is_active ? 'Block' : 'Unblock'}
</button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>




      </table>
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

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          <form onSubmit={updateUser} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editingUser?.name || ''}
              onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Role"
              value={editingUser?.role || ''}
              onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  </>
  )
}

export default Usermanagement







