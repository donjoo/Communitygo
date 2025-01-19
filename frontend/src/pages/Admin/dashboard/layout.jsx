import React, { useState } from 'react';
import AdminNavbar from "../../../components/AdminComponents/AdminNavbar";
import AdminFooter from "../../../components/AdminComponents/AdminFooter";

import { DashboardSidebar } from "../../../components/AdminComponents/dashboard-sidebar";

// import AdminNavbar from './AdminComponents/AdminNavbar'

// export function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen overflow-hidden">
//       <DashboardSidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <AdminNavbar />
//         <main className="flex-1 overflow-y-auto bg-secondary/10">
//           <div className="container mx-auto py-6 px-4">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


// import { Button } from "../..; // Adjust import as necessary
import { Menu } from 'lucide-react'; // Import hamburger icon

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Hamburger Button */}
      <button 
        className="md:hidden p-4 fixed top-4 left-4 z-40 bg-white rounded-md shadow-md" 
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <AdminNavbar /> */}
        <main className="flex-1 overflow-y-auto bg-secondary/10">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
          <AdminFooter />

        </main>
      </div>
    </div>
  );
}
