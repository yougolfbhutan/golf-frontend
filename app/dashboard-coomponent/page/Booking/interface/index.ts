export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
// ^ only "pending" appears in your sample. Adjust to the statuses your backend uses.

export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phone_no: string;
  country_code: string;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: unknown[]; // use Role[] from auth-context if it is the same shape
  permissions: unknown[]; // use Permission[] from auth-context if it is the same shape
  // password and refresh_token are deliberately left out. The backend should not send them.
}

export interface BookingGolfCourse {
  id: number;
  name: string;
  description: string | null;
  maxGolfersPerSlot: number;
  isActive: boolean;
  prices: Record<string, number> | null; // only null in your sample
  imageUrl: string;
}

export interface BookingGolferCategory {
  id: number;
  name: string;
  isActive: boolean;
}

export interface BookingGolfSet {
  id: number;
  name: string;
  description: string;
  audienceId: number;
  handedness: "left" | "right";
  tierName: string; // e.g. "Standard" | "Premium"
  isAvailable: boolean;
  imageUrl: string;
  quantity: number; // stock quantity
  price: number;
}

// Gloves and balls are null in your sample, so these shapes are guesses.
// Replace them with your real glove and ball interfaces.
export interface BookingGlove {
  id: number;
  name: string;
  imageUrl?: string;
  price: number;
}

export interface BookingBall {
  id: number;
  name: string;
  imageUrl?: string;
  price: number;
}

export interface BookingItem {
  id: number;
  bookingId: number;
  golfSetId: number | null;
  golfSet: BookingGolfSet | null;
  gloveId: number | null;
  glove: BookingGlove | null;
  ballId: number | null;
  ball: BookingBall | null;
  quantity: number;
  unitPrice: number;
}

export interface Booking {
  id: number;
  customerId: string;
  customer: BookingCustomer;
  golfCourseId: number;
  golfCourse: BookingGolfCourse;
  golferCategoryId: number;
  golferCategory: BookingGolferCategory;
  teeDate: string; // "YYYY-MM-DD"
  teeTime: string; // "HH:mm:ss"
  numberOfGolfers: number;
  status: BookingStatus;
  totalAmount: number;
  currency: string; // e.g. "BTN"
  notes: string | null;
  items: BookingItem[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  
}


export interface BookingGetResponse{
  success:boolean;
  message:string;
  data:{data:Booking[];
    total:number;
    page:number;
    limit:number;
    totalPages:number
  }
}