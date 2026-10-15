export interface GlovesPayloadAttribes {
  name: string;
  audienceId: number;

  size: string;

  handedness: string;
  tierName: string;
  isAvailable: boolean;

  quantity: number;
  price: number;
  image?: string;
}

export interface Audience {
  id: number;
  name: string;
}

export interface Glove {
  id: number;
  name: string;
  audienceId: number;
  audience: Audience;
  size: string;
  handedness: string;
  isAvailable: boolean;
  imageUrl: string;
  quantity: number;
  price: number;
  tierName: string;
  currency: string;
}

export interface GlovesGetResponse {
  success: boolean;
  message: string;
  data: {
    data: Glove[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
