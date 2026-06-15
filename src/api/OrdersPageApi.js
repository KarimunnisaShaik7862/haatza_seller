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

export const RequestTypes = {
  trackshipping: "https://haatza.com/_functions/trackshipping"
};

export const fetchTrackingDetails = async (trackingId) => {
  const res = await fetch(`${RequestTypes.trackshipping}?waybill=${trackingId}`);
  const data = await res.json();
  console.log("Tracking Response", data);
  return data;
};

export const updateOrdersstatus = async (orderId, sellerId, status) => {
  const payload = { orderId: Number(orderId), sellerId, status };
  console.log("updateOrdersstatus Request:", payload);
  const res = await fetch(`${BASE_URL}/updateOrdersstatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log("updateOrdersstatus Response:", data);
  return data;
};

export const getDeliveryAmount = async (o_pin, d_pin, cgm) => {
  const url = `${BASE_URL}/getDeliveryAmount?o_pin=${o_pin}&d_pin=${d_pin}&cgm=${cgm}`;
  console.log("getDeliveryAmount Request:", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("getDeliveryAmount Response:", data);
  return data;
};

export const expectedTat = async (sellerPinCode, toPincode) => {
  const url = `${BASE_URL}/expectedTat?sellerPinCode=${sellerPinCode}&toPincode=${toPincode}`;
  console.log("expectedTat Request:", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("expectedTat Response:", data);
  return data;
};

export const createShipment = async (orderId, sellerId, trackingId) => {
  const payload = {
    orderId: Number(orderId),
    sellerId,
    OrderId: Number(orderId),
    SellerId: sellerId,
    trackingId: trackingId || "",
    tracking_id: trackingId || "",
    waybill: trackingId || "",
    awb: trackingId || "",
    AWB: trackingId || ""
  };
  console.log("createShipment Request:", payload);
  const res = await fetch(`${BASE_URL}/createShipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log("createShipment Response:", data);
  return data;
};


