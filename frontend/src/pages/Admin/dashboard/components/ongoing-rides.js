import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Car } from 'lucide-react'
import adminAxiosInstance from "../../../../adminaxiosconfig";

export function OngoingRides() {

  const [count,SetCount ] = useState(0);

  const ridecount = async() => {
    const response = await adminAxiosInstance.get('dashboard/rides_count/');
    SetCount(response.data.ongoing_rides)

  }

  useEffect(() =>{
    ridecount()
  },[])


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Ongoing Rides
        </CardTitle>
        <Car className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          includes ongoing ride only
        </p>
      </CardContent>
    </Card>
  )
}

