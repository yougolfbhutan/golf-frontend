"use client";

// import NavBar from "@/custom-components/navbar/navbar";

import Footer from "@/custom-components/footer/footer";
import HeroSlider from "@/custom-components/navbar/hero-slider";
import { slides } from "@/custom-components/navbar/data";
import Navbar from "@/custom-components/navbar/navbar";
import CustomerBookingPage from "./booking/booking-page";

export default function Home() {
  
  return (
    <div className=" w-full max-w-full overflow-x-hidden  ">
      <Navbar />
      {/* <HeroSlider slides={slides} /> */}
      <CustomerBookingPage />

      <Footer />
    </div>
  );
}
