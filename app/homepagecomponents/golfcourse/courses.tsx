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
  bookingId?: string; // Optional property for booking ID
}

export const coursesdata: Course[] = [
  {
    id: 1,
   bookingId: "rtgc",
    name: "Royal Thimphu Golf Course",
    location: "Chhophel Lam, Thimphu",
    tagline: "Where the Himalaya meets perfection",
    holes: 9,
    par: 35,
    length: "3,020 yds",
    rating: "70.5 / 125",
    founded: "1971",
    green_fee: "$45",
    features: [
      "Mountain Views",
      "Private Caddies",
      "Dzong Backdrop",
      "Open to Public",
    ],
    club_Facilities: [
      "Clubhouse",
      "Pro Shop",
      "Driving Range",
      "Club / Shoe Rental",
    ],
    image: ["/golf-course1.jpg", "/golf-course2.jpg"],
    stars: 5,
    description:
      "Founded in 1971 and set near Tashichho Dzong at an altitude of over 7,500 feet, this is Bhutan's most iconic course. Play among pine-lined fairways with Himalayan views, then relax at the clubhouse. Open to the public, with a pro shop and driving range on site.",
  },
  {
    id: 2,
    bookingId: "drakpoi",
    name: "Drakpoi Golf Course",
    location: "Thimphu",
    tagline: "Mountain grandeur, immaculate greens",
    holes: 18,
    par: 71,
    length: "6,820 yds",
    rating: "73.1 / 138",
    founded: "1964",
    green_fee: "$95",
    features: [
      "Mountain Terrain",
      "Bentgrass Greens",
      "Full Spa",
      "On-site Lodging",
    ],
    club_Facilities: [
      "Practice Facilities",
      "Lessons",
      "Dining",
      "Club / Shoe Rental",
    ],
    image: ["/golf-course2.jpg", "/golf-course1.jpg"],
    stars: 5,
    description:
      "An 18-hole championship layout winding through mountain terrain, known for immaculate bentgrass greens and sweeping valley views. Guests can extend their stay with on-site lodging and a full spa after the round.",
  },
  
];