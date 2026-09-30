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
  //   category: string;
  features: string[];
  club_Facilities: string[];
  image: string[];
  stars: number;
  description: string;
}

export const courses: Course[] = [
  {
    id: 1,
    name: "Royal Thimphu Golf Course",
    location: "Chhophel Lam, Thimphu",
    tagline: "Where the Himalaya meets perfection",
    holes: 9,
    par: 35 / 70,
    length: "7,040 yds",
    rating: "75.5 / 145",
    founded: "1971",
    green_fee: "$595",
    // category: "Championship",
    features: [
      "Ocean Views",
      "Private Caddies",
      "Cliff-side Holes",
      "Members Only",
    ],
    image: ["/golf-course2.jpg", "/golf-course1.jpg"],
    stars: 5,
    club_Facilities: [
      "Practice Facilities",
      "Lessons",
      "Dining",
      "Club / Shoe Rental",
    ],

    description:
      "Founded in 1971, situated near Tashichho Dzong, altitude over 7,500 feet, open to the public, includes a clubhouse, pro shop, and driving range. ",
  },
  {
    id: 2,
    name: "Drakpoi Golf Course",
    location: "Thimphu",
    tagline: "Mountain grandeur, immaculate greens",
    holes: 18,
    par: 71,
    length: "6,820 yds",
    rating: "73.1 / 138",
    founded: "1964",
    green_fee: "$395",
    // category: "Resort",
    features: [
      "Mountain Terrain",
      "Bentgrass Greens",
      "Full Spa",
      "On-site Lodging",
    ],
    image: ["/golf-course2.jpg", "/golf-course1.jpg"],
    club_Facilities: [
      "Practice Facilities",
      "Lessons",
      "Dining",
      "Club / Shoe Rental",
    ],
    description:
      "Jumeirah Golf Estates, home to two world-renowned golf courses, offers an unforgettable experience at its Earth Course. Designed by legendary golfer Greg Norman, this 18-hole championship course is the centerpiece of Dubai’s premier golf community and the host of the prestigious DP World Tour Championship, the European ",

    stars: 5,
  },
];
