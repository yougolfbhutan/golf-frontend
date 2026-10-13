export const API_CUSTOMERURL = process.env.NEXT_PUBLIC_CUSTOMER_URL;
const CUSTOMER_API_URL = {
  getCarrysetCaddie: `${API_CUSTOMERURL}/get-carryset-caddie`,
  getAccessories:`${API_CUSTOMERURL}/get-item`,
  login: `${API_CUSTOMERURL}/users/login`,
  register: `${API_CUSTOMERURL}/users`, 

  golfSet:`${API_CUSTOMERURL}/golf-set`,
   glove: `${API_CUSTOMERURL}/glove`,
   ball:`${API_CUSTOMERURL}/ball`,

 
};

export default CUSTOMER_API_URL;
