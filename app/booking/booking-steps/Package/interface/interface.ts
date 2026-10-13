interface Audience {
  name: string;
  id: number;
}

export interface GolfSetAttributes {
  id: number;
  name: string;
  description: string;
  audience: Audience;
  handedness: "left" | "right";
  isAvailable: boolean;
  imageUrl: string;
  quantity: number;
  price: number;
  tierName: "Standard" | "Premium";
}

export interface getGolfSetResponse {
  data: {
    data: GolfSetAttributes[];
  };
  success: boolean;
  message: string;
}
