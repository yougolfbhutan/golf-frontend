export interface GolfCourse {
  id: number;
  golf_course_name: string;
  golf_course_location_name: string;
  golf_course_location_description: string;
}

// API response interface
export interface GolfCourseApiResponse {
  data: GolfCourse[];
  message: string;
  status: number;
}

