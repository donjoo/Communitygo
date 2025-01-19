import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Package } from 'lucide-react'
import adminAxiosInstance from "../../../../adminaxiosconfig";

export function OngoingDeliveries() {

  const [count,SetCount ] = useState(null);

  const deliverycount = async() => {
    const response = await adminAxiosInstance.get('dashboard/deliveries_count/');
    SetCount(response.data.ongoing_deliveries)

  }

  useEffect(() =>{
    deliverycount()
  },[])
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Ongoing Deliveries
        </CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
        includes assigned and pickedup deliveries
        </p>
      </CardContent>
    </Card>
  )
}

