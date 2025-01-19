import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"

const topDrivers = [
  { id: 1, name: "John Doe", avatar: "/placeholder-user.jpg", rides: 120, rating: 4.8 },
  { id: 2, name: "Jane Smith", avatar: "/placeholder-user.jpg", rides: 115, rating: 4.9 },
  { id: 3, name: "Mike Johnson", avatar: "/placeholder-user.jpg", rides: 108, rating: 4.7 },
  { id: 4, name: "Sarah Williams", avatar: "/placeholder-user.jpg", rides: 102, rating: 4.8 },
  { id: 5, name: "Chris Brown", avatar: "/placeholder-user.jpg", rides: 95, rating: 4.6 },
]

export function TopDrivers() {
  return (
    <div className="space-y-8">
      {topDrivers.map((driver) => (
        <div key={driver.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={driver.avatar} alt="Avatar" />
            <AvatarFallback>{driver.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{driver.name}</p>
            <p className="text-sm text-muted-foreground">
              {driver.rides} rides
            </p>
          </div>
          <div className="ml-auto font-medium">
            {driver.rating} ⭐
          </div>
        </div>
      ))}
    </div>
  )
}

