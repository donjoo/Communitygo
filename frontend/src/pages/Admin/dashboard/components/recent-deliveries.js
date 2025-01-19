import { Avatar, AvatarFallback, AvatarImage } from "../../../../component/ui/avatar"

export function RecentDeliveries() {
  return (
    <div className="space-y-8">
      {recentDeliveries.map((delivery) => (
        <div key={delivery.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={delivery.avatar} alt="Avatar" />
            <AvatarFallback>{delivery.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{delivery.name}</p>
            <p className="text-sm text-muted-foreground">
              {delivery.from} to {delivery.to}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {delivery.status}
          </div>
        </div>
      ))}
    </div>
  )
}

const recentDeliveries = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder-user.jpg",
    from: "New York",
    to: "Los Angeles",
    status: "In Transit",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/placeholder-user.jpg",
    from: "Chicago",
    to: "Houston",
    status: "Delivered",
  },
  {
    id: "3",
    name: "Bob Johnson",
    avatar: "/placeholder-user.jpg",
    from: "Miami",
    to: "Seattle",
    status: "Pending",
  },
  {
    id: "4",
    name: "Alice Brown",
    avatar: "/placeholder-user.jpg",
    from: "Boston",
    to: "San Francisco",
    status: "In Transit",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    avatar: "/placeholder-user.jpg",
    from: "Denver",
    to: "Phoenix",
    status: "Delivered",
  },
]

