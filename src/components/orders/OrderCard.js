import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, CalendarDays, Truck } from "lucide-react";

const STATUS_CLASS = {
  "Order Placed": "status-pending",
  "Order Confirmed": "status-confirmed",
  "Shipped": "status-shipped",
  "Order Cancelled": "status-cancelled",
};

const renderProductOption = (option) => {
  if (!option) return "-";
  if (typeof option === "object") {
    return option.Size || option.size || Object.values(option)[0] || "-";
  }
  return String(option);
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const statusClass = STATUS_CLASS[order.status] || "status-pending";

  const handleClick = () => {
    navigate("/orders/details", {
      state: { tableId: order.tableId, orderId: order.orderId },
    });
  };

  return (
    <motion.div
      className="glass-card order-card"
      whileHover={{ scale: 1.01 }}
      onClick={handleClick}
    >
      <div className="order-card-img">
        <img
          src={order.productimage || "https://via.placeholder.com/80"}
          alt={order.items || "Product"}
        />
      </div>

      <div className="order-card-body">
        <div className="order-card-top">
          <span className="order-id">#{order.orderId}</span>
          <span className={`status-badge ${statusClass}`}>{order.status}</span>
        </div>

        <h4 className="order-product-name">{order.items}</h4>

        {order.productOption && (
          <p className="order-meta-line">Size: {renderProductOption(order.productOption)}</p>
        )}

        <div className="order-card-dates">
          <span className="order-date-chip">
            <CalendarDays size={14} />
            Ordered: {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : "-"}
          </span>
          <span className="order-date-chip">
            <Truck size={14} />
            ETA: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>

      <button className="order-card-arrow" aria-label="View order details">
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

export default OrderCard;
