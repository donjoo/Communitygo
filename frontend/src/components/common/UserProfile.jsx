import React, { useEffect, useState } from 'react'

function UserProfile({user,deliveries}) {

  const [deliverlen, setDeliverylen] = useState(null)

  useEffect(() => {
    if (deliveries?.length !== undefined){
      setDeliverylen(deliveries.length);
    }
  },[deliveries])


  return (
        <main class="container mx-auto py-8">
          <section class="flex items-center space-x-8">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              class="w-36 h-36 rounded-full"
            />
            <div>
              <h2 class="text-4xl font-bold">{user.username}</h2>
              <p class="text-gray-700">{user.first_name} {user.last_name}</p>
              {/* <p class="text-gray-700 mt-1">{user.email}</p> */}
            </div>
          </section>

          <section class="mt-8 my-20">
            <h3 class="text-2xl font-semibold mb-4">Details</h3>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-gray-500">Email</dt>
                <dd class="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Phone</dt>
                <dd class="font-medium">+{user.phone_number}</dd>
              </div>
              <div>
                <dt class="text-gray-500">date joined</dt>
                <dd class="font-medium">{user.date_joined}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Last Login</dt>
                <dd class="font-medium">{user.last_login}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Number of requested deliveries:</dt>
                <dd class="font-medium">{deliverlen}</dd>
              </div>

            </dl>
          </section>
        </main>
  )
}

export default UserProfile
