import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Car } from 'lucide-react'

export function OngoingRides() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Ongoing Rides
        </CardTitle>
        <Car className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">28</div>
        <p className="text-xs text-muted-foreground">
          +2% from last hour
        </p>
      </CardContent>
    </Card>
  )
}

