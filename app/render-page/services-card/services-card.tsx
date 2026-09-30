"use client";

import { GolfCourse } from "@/app/src/interface/get-golfcourse/get-golfcourse";
import { ImageWithFallback } from "@/components/Image-with-fallback/image-with-fallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  MapPin, Star } from "lucide-react";

import React from "react";

interface ServicesCard {
  data?: GolfCourse[];
  onPress?:() => void
}

const CustomServiceCard: React.FC<ServicesCard> = ({ data,onPress }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Golf Courses
          </h2>
          <p className="text-gray-600">
            Play at some of the world&apos;s most prestigious golf destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow p-0"
            >
              <div className="relative">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`}
                  alt={item.golf_course_name}
                  className="w-full h-full object-cover object-top "
                />
                {/* <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">
                    {availability}
                  </Badge>
                </div> */}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {item.golf_course_location_name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      {item.golf_course_name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Star
                      size={16}
                      className="text-yellow-400 fill-current mr-1"
                    />
                    <span className="font-semibold">{"5"}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    {item.golf_course_location_description}
                  </p>

                  <div className="flex justify-between items-center pt-5 border-t">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ${300}
                      </span>
                      <span className="text-gray-500 text-sm ml-1 mb-10">
                        per round
                      </span>
                    </div>
                    <Button
                      onClick={onPress}
                      className="bg-green-600 hover:bg-green-700 mb-5 mt-2"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
          onClick={onPress}
            size="lg"
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomServiceCard;
