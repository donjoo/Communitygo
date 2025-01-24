import React from "react";
import {
    Button
  } from "../component/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../component/ui/card";
import {
  UsersIcon,
  TruckIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";


function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

        <Navbar />
      {/* Header Section */}
      <header className="w-full bg-gray-600 py-12 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-lg">
            Connecting people through smart delivery and ridesharing solutions.
          </p>
        </div>
      </header>

      {/* Mission and Vision Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
        <p className="mt-4 text-gray-600">
          To revolutionize the way people move and deliver, by creating an
          eco-friendly, efficient, and affordable platform for everyone.
        </p>
        <h2 className="mt-12 text-3xl font-bold text-gray-800">Our Vision</h2>
        <p className="mt-4 text-gray-600">
          To become the leading crowdsourced platform, making cities smarter
          while fostering a sustainable future.
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader>
            <UsersIcon className="h-12 w-12 text-blue-500" />
            <CardTitle>User-Centric</CardTitle>
            <CardDescription>Designed for seamless interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our platform is built with you in mind, ensuring a user-friendly
              experience from start to finish.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <TruckIcon className="h-12 w-12 text-green-500" />
            <CardTitle>Delivery & Ridesharing</CardTitle>
            <CardDescription>Efficient solutions for all.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Whether you need to send a package or share a ride, we’ve got you
              covered.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <GlobeAltIcon className="h-12 w-12 text-yellow-500" />
            <CardTitle>Global Reach</CardTitle>
            <CardDescription>Expanding boundaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We’re constantly growing, bringing our services to new cities and
              communities worldwide.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <ShieldCheckIcon className="h-12 w-12 text-red-500" />
            <CardTitle>Safe & Secure</CardTitle>
            <CardDescription>Your safety, our priority.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our platform ensures the highest safety standards for all users,
              at all times.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-blue-600 py-12 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Join Us Today</h2>
          <p className="mt-4 text-lg">
            Be a part of the movement and experience the future of delivery and
            ridesharing.
          </p>
          <Link to="/">
  <Button className="mt-6 bg-white text-blue-600 hover:bg-gray-200">
    Get Started
  </Button>
</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AboutUs;
