import axios from "axios"
import { CarrySetApiResponse } from "../../interface/fetch-carryset/fetch-carryset"
import { APIURL } from "@/api/api"

export const fetchCarrySet = ():Promise<CarrySetApiResponse> =>{
    return axios.get(APIURL.getCarryset).then((response)=>response.data)
}