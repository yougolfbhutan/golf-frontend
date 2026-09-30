interface imageurls {
  url?: string;
}
interface CarrySet {
  id: number;
  carrysettname: string;
  availibility: true;
  golf_course_location_description: string;
  urls: imageurls[];
}

// API response interface
export interface CarrySetApiResponse {
  data: CarrySet[];
  message: string;
  status: number;
}
