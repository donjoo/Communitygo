import { useEffect, useState } from "react"
import adminAxiosInstance from "../../../../adminaxiosconfig"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Users } from 'lucide-react'

export function UserCount() {
  const [count,SetCount ] = useState(null);

  const usercount = async() => {
    const response = await adminAxiosInstance.get('dashboard/user_count/');
    SetCount(response.data.user_count)

  }

  useEffect(() =>{
    usercount()
  },[])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Users
        </CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          +10% from last month
        </p>
      </CardContent>
    </Card>
  )
}

