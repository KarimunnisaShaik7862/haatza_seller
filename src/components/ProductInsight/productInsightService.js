import axios from "axios";

const BASE_URL = "https://haatza.com/_functions";

/**
 * Fetches the detail overview of a product by its Table_ID
 * @param {string} tableId 
 * @returns {Promise<object>} Product detail object
 */
export const getProductDetails = async (tableId) => {
  const response = await axios.get(`${BASE_URL}/sellerProductDetails`, {
    params: { Table_ID: tableId },
  });
  return response.data;
};

/**
 * Fetches the engagement stats and trend reports of a product by its Table_ID
 * @param {string} tableId 
 * @returns {Promise<object>} Analytics response object
 */
export const getProductStats = async (tableId) => {
  const response = await axios.get(`${BASE_URL}/getProductStats`, {
    params: { tableId },
  });
  return response.data;
};

/**
 * Fetches the list of products for a seller by email
 * @param {string} email 
 * @returns {Promise<object>} List of products
 */
export const getSellerProducts = async (email) => {
  const response = await axios.get(`${BASE_URL}/seller_products`, {
    params: { email, page: 1, limit: 100, type: "mylisting" },
  });
  return response.data;
};

const productInsightService = {
  getProductDetails,
  getProductStats,
  getSellerProducts,
};

export default productInsightService;
