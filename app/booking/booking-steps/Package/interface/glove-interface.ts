interface Audience {
  name: string;
  id: number;
}

export interface GloveAttributes {
  id: number;
  name: string;
    audience: Audience;

  size: string;
  handedness: "left" | "right";
  isAvailable: boolean;
  imageUrl: string;
  quantity: number;
  price: number;
  tierName: "Standard" | "Premium";
  currency: string;
}

export interface getGloveResponse {
  data: {
    data: GloveAttributes[];
  };
  success: boolean;
  message: string;
}
