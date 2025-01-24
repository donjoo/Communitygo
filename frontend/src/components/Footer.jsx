import React from 'react'
// import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12 mt-auto w-full">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-orange-500">CommunityGo</h2>
          <p className="text-sm text-slate-400">Empowering communities through shared resources.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/aboutus" className="text-slate-400 hover:text-orange-500 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-slate-400 hover:text-orange-500 transition-colors">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/my_earnings" className="text-slate-400 hover:text-orange-500 transition-colors">
                My Earnings
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-400 hover:text-orange-500 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/ridesharing" className="text-slate-400 hover:text-orange-500 transition-colors">
                Ridesharing
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="text-slate-400 hover:text-orange-500 transition-colors">
                Delivery
              </Link>
            </li>
            <li>
              <Link href="/community-events" className="text-slate-400 hover:text-orange-500 transition-colors">
                Community Events
              </Link>
            </li>
            <li>
              <Link href="/resource-sharing" className="text-slate-400 hover:text-orange-500 transition-colors">
                Resource Sharing
              </Link>
            </li>
          </ul>
        </div>
        {/* <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-slate-400 mb-4">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <form className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400"
            />
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Subscribe</Button>
          </form>
        </div> */}
      </div>
      <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} CommunityGo. All rights reserved.
      </div>
    </div>
  </footer>
  )
}

export default Footer
