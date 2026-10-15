export const API_ADMIN = 'https://golf-backend-4h1w.onrender.com';
const ADMIN_API_URL = {
  // login: `${API_ADMIN}/customer/signin`,
  // LogOut: `${API_ADMIN}/auth/logout`,

  createPermission: `${API_ADMIN}/create-permission`,
  updatePermission: `${API_ADMIN}/update-permission`,
  deletePermission: `${API_ADMIN}/delete-permission`,
  getPermission: `${API_ADMIN}/get-permission`,

  //role
  createRole: `${API_ADMIN}/create-role`,
  updateRole: `${API_ADMIN}/update-role`,
  deleteRole: `${API_ADMIN}/delete-role`,
  getRole: `${API_ADMIN}/get-role`,

  //user
  createUser: `${API_ADMIN}/create-user`,
  updateUser: `${API_ADMIN}/update-user`,
  deleteUser: `${API_ADMIN}/delete-user`,
  getUsers: `${API_ADMIN}/get-user`,
  //golfset
  golfset: `${API_ADMIN}/golf-set`,
  //gloves
  gloves: `${API_ADMIN}/glove`,
  balls: `${API_ADMIN}/ball`,
  booking: `${API_ADMIN}/booking`,







};

export default ADMIN_API_URL;
