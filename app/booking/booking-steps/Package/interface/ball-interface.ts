export interface BallAttributes {
  id: number;
  name: string;
  quantity: number;
  imageUrl: string;

  price: number;
  tierName: "Standard" | "Premium";
  currency: string;
}

export interface getBallResponse {
  data: {
    data: BallAttributes[];
  };
  success: boolean;
  message: string;
}
