const BASE_URL = "https://haatza.com/_functions";

export const fetchSellerOrders = async (sellerId) => {
  const res = await fetch(`${BASE_URL}/sellernewOrders?sellerId=${sellerId}`);
  const data = await res.json();
  console.log("Seller Orders Response", data);
  return data;
};

export const fetchOrderDetails = async (tableId) => {
  const res = await fetch(`${BASE_URL}/sellerOrderdetails?tableId=${tableId}`);
  const data = await res.json();
  console.log("Order Details Response", data);
  return data;
};
