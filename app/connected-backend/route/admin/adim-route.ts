export const API_ADMIN = "https://golf-backend-4h1w.onrender.com";
const ADMIN_API_URL = {
  // login: `${API_ADMIN}/customer/signin`,
  // LogOut: `${API_ADMIN}/auth/logout`,

  permissions: `${API_ADMIN}/permissions`,

  //role
  roles: `${API_ADMIN}/roles`,

  //user
  users: `${API_ADMIN}/users`,

  //golfset
  golfset: `${API_ADMIN}/golf-set`,
  //gloves
  gloves: `${API_ADMIN}/glove`,
  balls: `${API_ADMIN}/ball`,
  booking: `${API_ADMIN}/booking`,
};

export default ADMIN_API_URL;
