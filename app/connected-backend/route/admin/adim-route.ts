export const API_ADMIN = process.env.NEXT_PUBLIC_ADMIN_URL;
console.log(API_ADMIN)
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

  //carryset
  createGolfset: `${API_ADMIN}/create-Golfset`,
  updateGolfset: `${API_ADMIN}/update-Golfset`,
  deleteGolfset: `${API_ADMIN}/delete-Golfset`,
  getGolfsets: `${API_ADMIN}/get-Golfset`,

  //souvenir
  createSouvenir: `${API_ADMIN}/create-souvenir`,
  updateSouvenir: `${API_ADMIN}/update-souvenir`,
  deleteSouvenir: `${API_ADMIN}/delete-souvenir`,
  getSouvenirs: `${API_ADMIN}/get-souvenirs`,

  //itemvariant
  createItemVariant: `${API_ADMIN}/create-itemvariant`,
  updateItemVariant: `${API_ADMIN}/update-itemvariant`,
  deleteItemVariant: `${API_ADMIN}/delete-itemvariant`,
  getItemVariants: `${API_ADMIN}/get-itemvariants`,
//order
  getOrders: `${API_ADMIN}/get-order`,

  //booking
  getBookings: `${API_ADMIN}/booking/get-orderbooking`,
  approveBooking: `${API_ADMIN}`,





};

export default ADMIN_API_URL;
