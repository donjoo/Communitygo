import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../component/ui/table"

function Courierlist({ couriers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const couriersPerPage = 6; // Number of couriers per page

  // Calculate total pages
  const totalPages = Math.ceil(couriers.length / couriersPerPage);

  // Get the current page's couriers
  const startIndex = (currentPage - 1) * couriersPerPage;
  const currentCouriers = couriers.slice(startIndex, startIndex + couriersPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (





    <div className="flex flex-col items-center justify-center">
    {/* Responsive Table Container */}
    <div className="w-full max-w-6xl px-4 overflow-x-auto">

    <Table  className="table-auto border border-gray-200 shadow-lg">

<TableHeader>
  <TableRow>
    <TableHead className="w-[150px] p-4 text-left">Courier ID</TableHead>
    <TableHead className="w-[150px] p-4 text-left">From</TableHead>
    <TableHead className="w-[150px] p-4 text-left">To</TableHead>
    <TableHead className="w-[150px] p-4 text-left">Package Size</TableHead>
    <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
    <TableHead className=" w-[150px] p-4 text-left">Details</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
{currentCouriers.map((courier) => (
<TableRow  key={courier.id}>
    <TableCell className=" p-4 font-medium">{courier.id}</TableCell>
    <TableCell className="p-4">{courier.delivery.from_address?.address_line_1}, {courier.delivery.from_address?.city}, {courier.delivery.from_address?.state}</TableCell>
    <TableCell className="p-4"> {courier.delivery.to_address?.address_line_1}, {courier.delivery.to_address?.city}, {courier.delivery.to_address?.state}</TableCell>
    <TableCell className="p-4"> {courier.delivery.package_size}</TableCell>
    <TableCell className="p-4">{courier.delivery.status}</TableCell>
  


    <TableCell className="">  <NavLink to={`/courierdetail/${courier.delivery.id}`} className="text-blue-500 hover:underline">
       View Details
         </NavLink></TableCell>
  </TableRow>
  ))}
</TableBody>
</Table>





</div>



















    {/* <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCouriers.map((courier) => (
          <div key={courier.id} className="bg-white border rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-orange-500 mb-4">
              Courier ID: {courier.id}
            </h2>
            <p className="text-gray-600">
              <strong>From:</strong> {courier.delivery.from_address?.address_line_1}, {courier.delivery.from_address?.city}, {courier.delivery.from_address?.state}
            </p>
            <p className="text-gray-600">
              <strong>To:</strong> {courier.delivery.to_address?.address_line_1}, {courier.delivery.to_address?.city}, {courier.delivery.to_address?.state}
            </p>
            <p className="text-gray-600">
              <strong>Package Size:</strong> {courier.delivery.package_size}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {courier.delivery.status}
            </p>
            <div className="mt-4">
            <NavLink to={`/courierdetail/${courier.delivery.id}`} className="text-blue-500 hover:underline">
                View Details
              </NavLink>            </div>
          </div>
        ))}
      </div> */}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-200'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-200'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Courierlist;
