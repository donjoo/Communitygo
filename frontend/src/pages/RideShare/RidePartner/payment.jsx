import React, { useState, useEffect } from "react";
import api from "../../../api";
import { PaymentButton } from "../../../components/payment/PaymentButton";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../../component/ui/card";
import { Skeleton } from "../../../component/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../../component/ui/alert";
import { AlertCircle, MapPin, Calendar, Car, User } from 'lucide-react';
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";


const PaymentPage = () => {
  const { partnerId } = useParams();
  const [ridePartner, setRidePartner] = useState(null);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const amount = 100

  useEffect(() => {
    // Fetch ride partner details
    const fetchRidePartner = async () => {
      try {
        const response = await api.get(`partner/${partnerId}/ridedetail/`);
        setRidePartner(response.data.partner);
        setRide(response.data.ride);
        console.log(response.data)
      } catch (err) {
        setError("Failed to load ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRidePartner();
  }, [partnerId]);



  const handleSuccess = async (response) => {
    try {
      // Complete delivery and transfer to courier
      navigate(`/partner/ridedetail/${ride.id}`)

      // await paymentApi.completeDelivery(delivery.id);
      // Update UI or navigate
    } catch (error) {
      console.error('Failed to complete delivery payment:', error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-4 space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Payment for Ride</h1>

    <Card>
      <CardHeader>
        <CardTitle>Ride Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Starting Point:</span> {ride.route.starting_point}
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Endpoint:</span> {ride.route.endpoint}
        </div>
        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Vehicle:</span> {ride.vehicle}
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Date:</span> {ride.date}
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Status:</span> {ride.status}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Pickup:</span> {ridePartner?.pickup}
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Dropoff:</span> {ridePartner?.dropoff}
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Seats Reserved:</span> {ridePartner?.seats}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-gray-900">
          Total Amount: ₹{ridePartner?.amount}
        </div>
        <p className="text-gray-600">
          Click the button below to proceed with the payment.
        </p>
        <PaymentButton
          amount={ridePartner.amount}
          providerId={ride.user.id}
          serviceType="ride"
          serviceId={ridePartner.id}
          onSuccess={handleSuccess}
          onError={(error) => console.error('Payment failed:', error)}
        />
      </CardContent>
    </Card>
  </div>
<Footer />
  </>
  );
};

export default PaymentPage;
