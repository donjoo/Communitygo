import React from "react";
import { Button } from "../component/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../component/ui/card";
// import {
//   UsersIcon,
//   TruckIcon,
//   GlobeAltIcon,
//   GlobeIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../component/ui/card"
import { UsersIcon, TruckIcon, GlobeIcon, ShieldCheckIcon } from "lucide-react"
function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <header className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">About Us</h1>
          <p className="mt-4 text-xl font-light text-slate-300">
            Connecting people through smart delivery and ridesharing solutions.
          </p>
        </div>
      </header>

      {/* Mission and Vision Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-semibold text-slate-800">Our Mission</h2>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          To revolutionize the way people move and deliver by creating an eco-friendly, efficient, and affordable
          platform for everyone.
        </p>
        <h2 className="mt-16 text-4xl font-semibold text-slate-800">Our Vision</h2>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          To become the leading crowdsourced platform, making cities smarter while fostering a sustainable future.
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<UsersIcon className="h-12 w-12 text-slate-800" />}
            title="User-Centric"
            description="Designed for seamless interactions."
            content="Our platform is built with you in mind, ensuring a user-friendly experience from start to finish."
          />
          <FeatureCard
            icon={<TruckIcon className="h-12 w-12 text-slate-800" />}
            title="Delivery & Ridesharing"
            description="Efficient solutions for all."
            content="Whether you need to send a package or share a ride, we've got you covered."
          />
          <FeatureCard
            icon={<GlobeIcon className="h-12 w-12 text-slate-800" />}
            title="Global Reach"
            description="Expanding boundaries."
            content="We're constantly growing, bringing our services to new cities and communities worldwide."
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-12 w-12 text-slate-800" />}
            title="Safe & Secure"
            description="Your safety, our priority."
            content="Our platform ensures the highest safety standards for all users, at all times."
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold">Join Us Today</h2>
          <p className="mt-4 text-lg font-light text-slate-300 max-w-2xl mx-auto">
            Be a part of the movement and experience the future of delivery and ridesharing.
          </p>
          <Link href="/">
            <Button className="mt-8 bg-white text-slate-800 hover:bg-slate-200 shadow-lg transition transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </section>


      <Footer />
    </div>
  );
}



function FeatureCard({ icon, title, description, content }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition duration-300 border-none">
      <CardHeader>
        <div className="mx-auto">{icon}</div>
        <CardTitle className="mt-4 text-xl font-bold text-slate-800">{title}</CardTitle>
        <CardDescription className="text-slate-500 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  )
}


export default AboutUs;
