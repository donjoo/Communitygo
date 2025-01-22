import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from "../../lib/utils"
import { Button } from "../../component/ui/button"
import { ScrollArea } from "../../component/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../component/ui/sidebar"
import { Package2, LayoutDashboard, Users, ShoppingCart, Car, BarChart2, Settings } from 'lucide-react'

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User managment",
    href: "/usermanagement",
    icon: Users,
  },
  {
    title: "Delivery management",
    href: "/deliverymanagement",
    icon: ShoppingCart,
  },
  {
    title: "Ride management",
    href: "/ridemanagement",
    icon: Car,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar({isOpen, onClose}) {
  const location = useLocation()
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider defaultOpen={open} onOpenChange={setOpen}>
 <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >        <SidebarHeader className="flex h-[60px] items-center px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Admin Dashboard</span>
          </Link> 

           {/* Close button for mobile view */}
           <button onClick={onClose} className="md:hidden ml-auto">
            Close
          </button>  

        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-60px)] pb-10">
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild active={location.pathname === item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 hover:bg-gray-100",
                        location.pathname === item.href && "bg-gray-100 font-semibold"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" className="w-full">
            Logout
          </Button>
        </SidebarFooter>
      </div>
    </SidebarProvider>
  )
}

