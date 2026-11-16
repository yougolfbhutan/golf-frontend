import { useQuery } from "@tanstack/react-query";
import { golfSetsQuery, glovesQuery, ballsQuery } from "../helper/kit-queries";

// returns GolfSetAttributes[] directly (not { data: { data } })
export function useGetGolfSets() {
  return useQuery(golfSetsQuery);
}


export function useGetGloves() {
  return useQuery(glovesQuery);
}
// returns BallAttributes[] directly
export function useGetBalls() {
  return useQuery(ballsQuery);
}