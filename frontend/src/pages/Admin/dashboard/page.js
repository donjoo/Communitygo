import { Card, CardContent, CardHeader, CardTitle } from "../../../component/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../component/ui/tabs"
import { Overview } from "./components/overview"
import { RecentDeliveries } from "./components/recent-deliveries"
import { RecentRides } from "./components/recent-rides"
import { UserCount } from "./components/user-count"
import { OngoingDeliveries } from "./components/ongoing-deliveries"
import { OngoingRides } from "./components/ongoing-rides"
// import { RevenueChart } from "./components/revenue-chart"
import { DeliveryOverview } from "./components/delivery-overview"
import { PackageSizeChart } from "./components/package-size-chart"
import { UserRegistrationGraph } from "./components/user-registration-graph"
import { RideOverviewGraph } from "./components/ride-overview-graph"
import { RideDurationChart } from "./components/ride-duration-chart"
import { TopDrivers } from "./components/top-drivers"
import { CustomerSatisfaction } from "./components/customer-satisfaction"
import AdminNavbar from "../../../components/AdminComponents/AdminNavbar"
import AdminFooter from "../../../components/AdminComponents/AdminFooter"
import adminAxiosInstance from "../../../adminaxiosconfig"
import { useEffect, useState } from "react"

export default function DashboardPage() {



  const [revenue,SetRevenue ] = useState(0);

  const totalrevenue = async() => {
    const response = await adminAxiosInstance.get('dashboard/revenue/');
    SetRevenue(response.data.total_revenue)

  }

  useEffect(() =>{
    totalrevenue()
  },[])

  return (
   
    <div className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="rides">Rides</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <UserCount />
              <OngoingDeliveries />
              <OngoingRides />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    *includes completed transaction only
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentDeliveries />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ride Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <RideOverviewGraph />
                </CardContent>
              </Card>
              {/* <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopDrivers />
                </CardContent>
              </Card> */}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>User Registration Trend</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <UserRegistrationGraph />
                </CardContent>
              </Card>
              {/* <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerSatisfaction />
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Delivery Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <DeliveryOverview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Package Size Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PackageSizeChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ride Duration Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <RideDurationChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentRides />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        {/* <AdminFooter /> */}
      </div>
   
  )
}

