import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"
import adminAxiosInstance from "../../../../adminaxiosconfig"
import { useEffect, useState } from "react";



export function TopDrivers() {


  const [topCouriers, setTopCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCouriers = async () => {
      try {
        const response = await adminAxiosInstance.get("/dashboard/couriers/top/");
        setTopCouriers(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch top couriers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCouriers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="space-y-8">
      {topCouriers.map((courier) => (
        <div key={courier.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={courier.avatar} alt="Avatar" />
            <AvatarFallback>{courier.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{courier.name}</p>
            <p className="text-sm text-muted-foreground">
              {courier.rides} deliveries
            </p>
          </div>
          <div className="ml-auto font-medium">
            {courier.rating} ⭐
          </div>
        </div>
      ))}
    </div>
  )
}

