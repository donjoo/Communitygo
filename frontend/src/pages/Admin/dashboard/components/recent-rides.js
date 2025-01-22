import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"
import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../../adminaxiosconfig"
export function RecentRides() {


  const [recentRides, setRecentRides] = useState([]);

  // Fetch data when component mounts and every 30 seconds
  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/recent-rides/');
        setRecentRides(response.data);
      } catch (error) {
        console.error("Error fetching recent rides:", error);
      }
    };

    // Initial fetch
    fetchRecentRides();

    // Set an interval to fetch data every 30 seconds
    const interval = setInterval(fetchRecentRides, 300000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {recentRides.map((ride) => (
        <div key={ride.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={ride.avatar} alt="Avatar" />
            <AvatarFallback>{ride.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{ride.name}</p>
            <p className="text-sm text-muted-foreground">
              {ride.from} to {ride.to}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {ride.status}
          </div>
        </div>
      ))}
    </div>
  )
}

