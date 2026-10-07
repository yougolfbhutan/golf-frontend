export const API_CUSTOMERURL = process.env.NEXT_PUBLIC_CUSTOMER_URL;
const CUSTOMER_API_URL = {
  getCarrysetCaddie: `${API_CUSTOMERURL}/get-carryset-caddie`,
  getAccessories:`${API_CUSTOMERURL}/get-item`,
  login: `${API_CUSTOMERURL}/signin`,
  createBooking: `http://localhost:4000/customer/booking`,

 
};

export default CUSTOMER_API_URL;
