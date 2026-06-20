import axios from "axios";

const BASE_URL = "https://haatza.com/_functions";

export const getProductDetails = async (tableId) => {
  const response = await axios.get(`${BASE_URL}/sellerProductDetails`, {
    params: { Table_ID: tableId },
  });
  return response.data;
};

export const getSellerProducts = async (email) => {
  const response = await axios.get(`${BASE_URL}/seller_products`, {
    params: { email, page: 1, limit: 30, type: "mylisting" },
  });
  return response.data;
};

export const getProductStats = async (tableId) => {
  const response = await axios.get(`${BASE_URL}/getProductStats`, {
    params: { tableId },
  });
  return response.data;
};

const productInsightService = {
  getProductDetails,
  getSellerProducts,
  getProductStats
};

export default productInsightService;
