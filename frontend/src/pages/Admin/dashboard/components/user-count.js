import { Card, CardContent, CardHeader, CardTitle } from "../../../../component/ui/card"
import { Users } from 'lucide-react'

export function UserCount() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Users
        </CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,234</div>
        <p className="text-xs text-muted-foreground">
          +10% from last month
        </p>
      </CardContent>
    </Card>
  )
}

