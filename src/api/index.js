import axios from "axios";

let API_URL = "https://homemadegoodies.onrender.com/api/";
if (window.location.hostname === "localhost") {
  API_URL = "https://localhost:7243/api/";
}

export const createAPIEndpoint = (endpoint) => {
  let baseURL = API_URL + endpoint + "/";
  return {
    fetchAll: () => axios.get(baseURL),
    fetchById: (id) => axios.get(baseURL + id),
    post: (newRecord) => axios.post(baseURL, newRecord),
    put: (id, updatedRecord) => axios.put(baseURL + id, updatedRecord),
    delete: (id) => axios.delete(baseURL + id),

    fetchByKitchenId: (kitchenId) =>
      axios.get(API_URL + `kitchens/${kitchenId}/${endpoint}`),
    fetchByCustomerId: (customerId) =>
      axios.get(API_URL + `customers/${customerId}/${endpoint}`),
    fetchByVendorId: (vendorId) =>
      axios.get(API_URL + `vendors/${vendorId}/${endpoint}`),
    fetchProduct: (kitchenId, productId) =>
      axios.get(API_URL + `kitchens/${kitchenId}/${endpoint}/${productId}`),
    fetchFave: (customerId, faveId) =>
      axios.get(API_URL + `customers/${customerId}/${endpoint}/${faveId}`),
    fetchCart: (customerId, cartId) =>
      axios.get(API_URL + `customers/${customerId}/${endpoint}/${cartId}`),
    fetchVendorOrder: (kitchenId, orderId) =>
      axios.get(API_URL + `kitchens/${kitchenId}/${endpoint}/${orderId}`),
    fetchCustomerOrder: (customerId, orderId) =>
      axios.get(API_URL + `customers/${customerId}/${endpoint}/${orderId}`),

    postKitchen: (vendorId, newRecord) =>
      axios.post(API_URL + `vendors/${vendorId}/${endpoint}`, newRecord),
    postProduct: (kitchenId, newRecord) =>
      axios.post(API_URL + `kitchens/${kitchenId}/${endpoint}`, newRecord),
    postFave: (customerId, kitchenId, newRecord) =>
      axios.post(API_URL + `customers/${customerId}/${endpoint}/`, newRecord),
    postCart: (customrId, kitchenId, newRecord) =>
      axios.post(API_URL + `customers/${customrId}/${endpoint}/`, newRecord),
    postOrder: (customerId, vendorId, kitchenId, cartId, newRecord) =>
      axios.post(
        API_URL + `customers/${customerId}/carts/${cartId}/${endpoint}`,
        newRecord
      ),
    postPaymentIntent: (paymentIntentDTO) =>
      axios.post(API_URL + "create-payment-intent", paymentIntentDTO),
    postCustomerReport: (customerId, vendorId, newRecord) =>
      axios.post(API_URL + `customers/${customerId}/${endpoint}`, newRecord),
    postVendorReport: (vendorId, newRecord) =>
      axios.post(API_URL + `vendors/${vendorId}/${endpoint}`, newRecord),

    putProduct: (kitchenId, productId, updatedRecord) =>
      axios.put(
        API_URL + `kitchens/${kitchenId}/${endpoint}/${productId}`,
        updatedRecord
      ),
    putFave: (customerId, kitchenId, faveId, updatedRecord) =>
      axios.put(
        API_URL + `customers/${customerId}/${endpoint}/${faveId}`,
        updatedRecord
      ),
    putCart: (customerId, cartId, updatedRecord) =>
      axios.put(
        API_URL + `customers/${customerId}/${endpoint}/${cartId}`,
        updatedRecord
      ),
    putOrder: (vendorId, orderId, updatedRecord) =>
      axios.put(
        API_URL + `vendors/${vendorId}/${endpoint}/${orderId}`,
        updatedRecord
      ),

    deleteProduct: (kitchenId, productId) =>
      axios.delete(API_URL + `kitchens/${kitchenId}/${endpoint}/${productId}`),
    deleteFave: (customerId, kitchenId, faveId) =>
      axios.delete(API_URL + `customers/${customerId}/${endpoint}/${faveId}`),
    deleteCart: (customerId, orderId, cartId) =>
      axios.delete(API_URL + `customers/${customerId}/${endpoint}/${cartId}`),
    deleteOrder: (kitchenId, orderId) =>
      axios.delete(API_URL + `kitchens/${kitchenId}/${endpoint}/${orderId}`),
  };
};

export const ENDPOINTS = {
  vendors: "vendors",
  registerVendor: "vendors/register",
  loginVendor: "vendors/login",
  loginGoogleVendor: "vendors/google",
  viewVendor: "vendors/:vendorId",
  editVendor: "vendors/edit",
  deleteVendor: "vendors/delete",

  customers: "customers",
  registerCustomer: "customers/register",
  loginCustomer: "customers/login",
  loginGoogleCustomer: "customers/google",
  viewCustomer: "customers/:customerId",
  editCustomer: "customers/edit",
  deleteCustomer: "customers/delete",

  kitchens: "kitchens",
  addKitchen: "kitchens/add",
  viewKitchen: "kitchens/:kitchenId",
  editKitchen: "kitchens/edit",
  deleteKitchen: "kitchens/delete",

  products: "products",
  addProduct: "products/add",
  viewProduct: "products/:productId",
  editProduct: "products/edit",
  deleteProduct: "products/delete",

  carts: "carts",
  addCart: "carts/add",
  viewCart: "carts/:cartId",
  editCart: "carts/edit",
  deleteCart: "carts/delete",

  faves: "faves",
  addFaves: "faves/add",
  viewFave: "faves/:cartId",
  editFave: "faves/edit",
  deleteFave: "faves/delete",

  orders: "orders",
  addOrder: "orders/add",
  viewOrder: "orders/:orderId",
  editOrder: "orders/edit",

  reports: "reports",
  viewReport: "reports/:reportId",
  editReport: "reports/edit",
  deleteReport: "reports/delete",
};
