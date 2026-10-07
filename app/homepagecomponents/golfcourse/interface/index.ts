// ---------- Booking ----------
export interface CreateBookingAttributes {
  partyName: string;
  partyEmail: string;
  partyPhone: string;
  teeTime: string;
  teeOffDate: string;
  golfCourseName?: string;
  carrySetId?: number;
  numberOfPlayers: number;
  totalPrice?: number;
  specialRequest?: string;
}

export interface BookingResponse {
  status: string;
  message: string;
}

export const INITIAL_BOOKING_VALUES: CreateBookingAttributes = {
  partyName: "",
  partyEmail: "",
  partyPhone: "",
  teeTime: "",
  teeOffDate: "",
  golfCourseName: "",
  carrySetId: 0,
  numberOfPlayers: 1,
  totalPrice: 0,
  specialRequest: "",
};

// ---------- Course ----------
export interface Course {
  id: number;
  name: string;
  location: string;
  tagline: string;
  holes: number;
  par: number;
  length: string;
  rating: string;
  founded: string;
  green_fee: string;
  features: string[];
  club_Facilities: string[];
  image: string[];
  stars: number;
  description: string;
}

export interface CourseCardProps {
  course: Course;
}

export const coursesdata: Course[] = [
  // ...paste the 5 courses from my earlier message here
];