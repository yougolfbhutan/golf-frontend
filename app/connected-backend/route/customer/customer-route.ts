export const API_CUSTOMERURL = process.env.NEXT_PUBLIC_CUSTOMER_URL;
console.log("api",API_CUSTOMERURL)
const CUSTOMER_API_URL = {
  getCarrysetCaddie: `https://golf-backend-4h1w.onrender.com/get-carryset-caddie`,
  getAccessories:`https://golf-backend-4h1w.onrender.com/get-item`,
  login: `https://golf-backend-4h1w.onrender.com/users/login`,
  register: `https://golf-backend-4h1w.onrender.com/users`, 

  golfSet:`https://golf-backend-4h1w.onrender.com/golf-set`,
   glove: `https://golf-backend-4h1w.onrender.com/glove`,
   ball:`https://golf-backend-4h1w.onrender.com/ball`,

 
};

export default CUSTOMER_API_URL;
