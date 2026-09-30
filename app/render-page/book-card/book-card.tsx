"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import GolfPrice from "@/custom-data/price/price-golf";
import { LandPlot } from "lucide-react";
import Image from "next/image";
import React from "react";

interface BookingCard {
  id?: number;
  titleText?: string;
  cardTitle?: string | null;
  cardDescription?: string;
  para?: string;
  url?: string ;
  index?: number;
  props?: number;
  pagelink?: string;
  golfname?: string;
  amount?: number;
  onPress?: ()=>void | undefined
}

const CustomBookingCard: React.FC<BookingCard> = ({
  cardTitle ,
  onPress,
  url

}) => {
  return (
    <Card className="hover:shadow-lg cursor-pointer transition-shadow duration-300">
      <CardContent className="flex flex-col p-4">
        <div className="flex justify-center items-center">
          <Image
            src={
              url ||"/golf.jpeg"
            } // Dynamic fallback
            alt={`Golf Image`}
            width={300}
            height={200}
            className="rounded-lg mb-4 object-cover"
          />
        </div>
        <div className="flex flex-row items-start justify-between mt-6">
          <CardTitle className="text-center ">{cardTitle}</CardTitle>
          <LandPlot color="green" size={34} className="mt-[-12px]"/>
        </div>
        <div className="flex flex-col justify-between mt-2 items-start">
          {GolfPrice.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between w-full mb-2"
            >
              <CardDescription className="text-left">
                {item.Name}
              </CardDescription>
              <CardDescription className="text-right mt-[-12px]">
                ${item.amount}
              </CardDescription>
            </div>
          ))}
        </div>
        <Button onClick={onPress}>Book</Button>
      </CardContent>
    </Card>
  );
};

export default CustomBookingCard;
