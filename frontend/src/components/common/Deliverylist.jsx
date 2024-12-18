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


function Deliverylist({ deliveries }) {
  const [currentPage, setCurrentPage] = useState(1);
  const deliveriesPerPage = 6; // Number of deliveries per page


  // Calculate total pages
  const totalPages = Math.ceil(deliveries.length / deliveriesPerPage);

  // Get the current page's deliveries
  const startIndex = (currentPage - 1) * deliveriesPerPage;
  const currentDeliveries = deliveries.slice(startIndex, startIndex + deliveriesPerPage);

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
      <TableHead className="w-[150px] p-4 text-left">Delivery ID</TableHead>
      <TableHead className="w-[150px] p-4 text-left">From</TableHead>
      <TableHead className="w-[150px] p-4 text-left">To</TableHead>
      <TableHead className="w-[150px] p-4 text-left">Package Size</TableHead>
      <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
      <TableHead className=" w-[150px] p-4 text-left">Details</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
      {currentDeliveries.map((delivery) => (

<TableRow  key={delivery.id}>
      <TableCell className=" p-4 font-medium">{delivery.id}</TableCell>
      <TableCell className="p-4">{delivery.from_address.address_line_1}, {delivery.from_address.city}, {delivery.from_address.state}</TableCell>
      <TableCell className="p-4">{delivery.to_address.address_line_1}, {delivery.to_address.city}, {delivery.to_address.state}</TableCell>
      <TableCell className="p-4">{delivery.package_size}</TableCell>
      <TableCell className="p-4">{delivery.status}</TableCell>
    


      <TableCell className="">  <NavLink to={`/deliverydetail/${delivery.id}`} className="text-blue-500 hover:underline">
         View Details
           </NavLink></TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>








{/* 
      // <div key={delivery.id} className="bg-white border rounded-lg shadow-lg p-6">
      //       <h2 className="text-xl font-semibold text-orange-500 mb-4">
      //         Delivery ID: {delivery.id}
      //       </h2>
      //       <p className="text-gray-600">
      //         <strong>From:</strong> {delivery.from_address.address_line_1}, {delivery.from_address.city}, {delivery.from_address.state}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>To:</strong> {delivery.to_address.address_line_1}, {delivery.to_address.city}, {delivery.to_address.state}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Package Size:</strong> {delivery.package_size}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Status:</strong> {delivery.status}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Details:</strong> {delivery.details}
      //       </p>
      //       <div className="mt-4">
      //         <NavLink to={`/deliverydetail/${delivery.id}`} className="text-blue-500 hover:underline">
      //           View Details
      //         </NavLink>
      //       </div>
      //     </div> */}
      
      </div> 

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Deliverylist;
