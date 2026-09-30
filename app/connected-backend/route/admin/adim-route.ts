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
  //caddie
  createCaddie: `${API_ADMIN}/create-caddie`,
  updateCaddie: `${API_ADMIN}/update-caddie`,
  deleteCaddie: `${API_ADMIN}/delete-caddie`,
  getCaddies: `${API_ADMIN}/get-caddie`,

  //carryset
  createCarrySet: `${API_ADMIN}/create-carryset`,
  updateCarrySet: `${API_ADMIN}/update-carryset`,
  deleteCarrySet: `${API_ADMIN}/delete-carryset`,
  getCarrySets: `${API_ADMIN}/get-carryset`,

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
