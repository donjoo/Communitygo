import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Package } from 'lucide-react'

export function OngoingDeliveries() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Ongoing Deliveries
        </CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">42</div>
        <p className="text-xs text-muted-foreground">
          +5% from last hour
        </p>
      </CardContent>
    </Card>
  )
}

