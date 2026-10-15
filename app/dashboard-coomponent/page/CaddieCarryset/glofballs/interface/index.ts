export interface BallsPayloadAttribes {
  name: string;

  tierName: string;

  quantity: number;
  price: number;
  image?: string;
}

export interface Balls {
  id: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  tierName: string;
  currency: string;
}

export interface BallsGetResponse {
  success: boolean;
  message: string;
  data: {
    data: Balls[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
