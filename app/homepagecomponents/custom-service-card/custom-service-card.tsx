"use client";

import CustomServiceCard from "@/app/render-page/services-card/services-card";
import { fetcgGolfCourse } from "@/app/src/services/fetch-golfcourse/fetch-golfcourse";
import { useQuery } from "@tanstack/react-query";


export default function ServiceCard() {
      const { data } = useQuery({
    queryKey: ["get-golfcourse"],
    queryFn: fetcgGolfCourse,
  });
//   console.log("Listening to the purna Rai song", data?.data);
  return (
    <>
          <CustomServiceCard data={data?.data} />

    </>
  );
}

