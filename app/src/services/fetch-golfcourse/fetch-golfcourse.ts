import axios from "axios"
import { GolfCourseApiResponse } from "../../interface/get-golfcourse/get-golfcourse"
import { APIURL } from "@/api/api"

export const fetcgGolfCourse = ():Promise<GolfCourseApiResponse> =>{
    return axios.get(APIURL.getGolfCourse).then((response)=>response.data)
}