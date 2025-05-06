import React from "react";
import { ShoppingCart, PackageOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Redirect } from "wouter";

// This is a redirect component that points to the BuyingPage
export default function Buy() {
  return <Redirect to="/buying" />;
}