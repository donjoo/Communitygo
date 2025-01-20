import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../../adminaxiosconfig";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"

export function RecentDeliveries() {


  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await adminAxiosInstance.get('dashboard/recent/deliveries/');
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
       
        setRecentDeliveries(response.data);
        console.log(response.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;



  return (
    <div className="space-y-8">
      {recentDeliveries.map((delivery) => (
        <div key={delivery.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={delivery.avatar} alt="Avatar" />
            <AvatarFallback>{delivery.user[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{delivery.user}</p>
            <p className="text-sm text-muted-foreground">
              {delivery.from_address?.address_line_1} to {delivery.to_address?.address_line_1}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {delivery.status}
          </div>
        </div>
      ))}
    </div>
  )
}

