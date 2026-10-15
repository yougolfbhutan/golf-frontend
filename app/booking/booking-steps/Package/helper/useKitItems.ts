import { mapGolfSets, kitItems, mapGloves, mapBalls } from "../data";
import { useGetGolfSets } from "../tanstack-function";
import { useGetBalls } from "../tanstack-function/ball-tanstackfunction";
import { useGetGloves } from "../tanstack-function/glove-tanstack";


export function useKitItems() {
  const { data, isLoading, isError } = useGetGolfSets();
   const { data: gloveData, isLoading: isGloveLoading, isError: isGloveError } = useGetGloves();
   console.log(gloveData?.data.data)
    const { data: ballData, isLoading: isBallLoading, } = useGetBalls();
  const sets = mapGolfSets(data?.data.data ?? []);
  const gloves = mapGloves(gloveData?.data.data ?? [])

  const balls = mapBalls(ballData?.data.data ?? [])

  const items = [...sets, ...gloves,...balls, ...kitItems]; // API sets + static items

  return { items, isLoading, isError };
}