import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"

export function RecentRides() {
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

const recentRides = [
  {
    id: "1",
    name: "Emma Davis",
    avatar: "/placeholder-user.jpg",
    from: "Downtown",
    to: "Airport",
    status: "Completed",
  },
  {
    id: "2",
    name: "Michael Lee",
    avatar: "/placeholder-user.jpg",
    from: "Suburb",
    to: "City Center",
    status: "In Progress",
  },
  {
    id: "3",
    name: "Sophia Garcia",
    avatar: "/placeholder-user.jpg",
    from: "University",
    to: "Shopping Mall",
    status: "Scheduled",
  },
  {
    id: "4",
    name: "Liam Taylor",
    avatar: "/placeholder-user.jpg",
    from: "Beach",
    to: "Hotel",
    status: "Completed",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    avatar: "/placeholder-user.jpg",
    from: "Restaurant",
    to: "Residential Area",
    status: "In Progress",
  },
]

