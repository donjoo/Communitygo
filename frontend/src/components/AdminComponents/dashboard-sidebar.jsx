import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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
import { Package2, LayoutDashboard, Users, ShoppingCart, Car, BarChart2, Settings, LogOut, User } from 'lucide-react'
import { useSelector } from 'react-redux'

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User management",
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
  // {
  //   title: "Analytics",
  //   href: "/dashboard/analytics",
  //   icon: BarChart2,
  // },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]

export function DashboardSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const user = useSelector((state) => state.auth.user)

  return (
    <SidebarProvider defaultOpen={open} onOpenChange={setOpen}>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <SidebarHeader className="flex h-[60px] items-center px-6 bg-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-gray-700">
            <Package2 className="h-6 w-6 text-blue-500" />
            <span>Admin Dashboard</span>
          </Link>

          {/* Close button for mobile view */}
          <button onClick={onClose} className="md:hidden ml-auto">
            ✕
          </button>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-120px)] pb-4">
            <SidebarMenu>
              {/* User Information */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || "Guest"}
                </span>
              </div>

              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild active={location.pathname === item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md",
                        location.pathname === item.href && "bg-gray-200 font-semibold"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout Option */}
              <SidebarMenuItem>
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 font-semibold rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="px-4 py-3 bg-gray-100">
          <div className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Admin Panel
          </div>
        </SidebarFooter>
      </div>
    </SidebarProvider>
  )
}
