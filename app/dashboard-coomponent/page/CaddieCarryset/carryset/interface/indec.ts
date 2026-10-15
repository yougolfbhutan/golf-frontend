export interface GolfSetAttributes {
  name: string;
  description:string
  audienceId: number;
  handedness: string;
  tierName: string;
  isAvailable:boolean

  quantity: number;
  price:number
    image?: string;
}
 export interface Audience {
  id: number;
  name: string;
}

export interface GolfSetData {
  id: number;
  name: string;
  description: string;
  audienceId: number;
  audience: Audience;
  handedness: 'left' | 'right';
  tierName: string;
  isAvailable: boolean;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface GolfSetGetResponse{
  success:boolean;
  message:string;
  data:{data:GolfSetData[],
    total: number;
  page: number;
  limit: number;
  totalPages: number;
  }
    
}