export type Tier = "standard" | "premium";
export type Handedness = "left" | "right";
export type Audience = "men" | "women" | "junior";

export interface GolfSet {
  id: number;
  name: string;
  description: string | null; // null if the description is optional in your DB
  tier: Tier;
  handedness: Handedness;
  audience: Audience;
  price: number;
  url: string | null; // first image, null when the set has no image
}

export interface GolfSetsData {
  golfSets: GolfSet[];
}

// Generic wrapper matching your ApiResponse
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type GolfSetsResponse = ApiResponse<GolfSetsData>;