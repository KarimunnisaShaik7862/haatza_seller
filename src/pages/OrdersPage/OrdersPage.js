import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  RefreshCw,
  Download,
  PackageCheck,
  Truck,
  XCircle,
  PackageSearch,
} from "lucide-react";
import { fetchSellerOrders } from "../../api/OrdersPageApi";
import ConfirmedOrdersPage from "../../components/orders/ConfirmedOrdersPage/ConfirmedOrdersPage";
import ShippedOrdersPage from "../../components/orders/ShippedOrdersPage/ShippedOrdersPage";
import CancelledOrdersPage from "../../components/orders/CancelledOrdersPage/CancelledOrdersPage";
import "../../components/orders/theme.css";
import "./OrdersPage.css";
console.log({ PackageCheck, Truck, XCircle, PackageSearch, Search, Calendar, RefreshCw, Download });
const TABS = [
  { key: "confirmed", label: "Confirmed Orders", icon: PackageCheck },
  { key: "shipped", label: "Shipped Orders", icon: Truck },
  { key: "cancelled", label: "Cancelled Orders", icon: XCircle },
];

const CONFIRMED_STATUSES = ["Order Placed", "Order Confirmed"];
const SHIPPED_STATUSES = ["Shipped"];
const CANCELLED_STATUSES = ["Order Cancelled"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("confirmed");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");

  const sellerId = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("haatzaSeller"));
      return stored?.sellerId || stored?.data?.sellerId || "HS1380";
    } catch {
      return "HS1380";
    }
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetchSellerOrders(sellerId);
      const list = Array.isArray(response) ? response : response?.message?.results || response?.items || response?.orders || [];
      setOrders(list);
    } catch (err) {
      console.error("Error fetching seller orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (search.trim()) {
      list = list.filter((o) =>
        String(o.orderId || "").toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (dateRange) {
      list = list.filter((o) => {
        const created = new Date(o.createdDate);
        const filterDate = new Date(dateRange);
        return (
          created.getFullYear() === filterDate.getFullYear() &&
          created.getMonth() === filterDate.getMonth() &&
          created.getDate() === filterDate.getDate()
        );
      });
    }

    return list;
  }, [orders, search, dateRange]);

  const grouped = useMemo(() => {
    const confirmed = filteredOrders.filter((o) => CONFIRMED_STATUSES.includes(o.status));
    const shipped = filteredOrders.filter((o) => SHIPPED_STATUSES.includes(o.status));
    const cancelled = filteredOrders.filter((o) => CANCELLED_STATUSES.includes(o.status));
    return { confirmed, shipped, cancelled };
  }, [filteredOrders]);

  const handleExport = () => {
    const headers = ["orderId", "status", "createdDate", "estimatedDelivery"];
    const rows = filteredOrders.map((o) => headers.map((h) => `"${o[h] ?? ""}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="haatza-page orders-page">
      <div className="orders-header glass-card">
        <div className="orders-header-top">
          <div>
            <h1 className="orders-title">Orders</h1>
            <p className="orders-subtitle">Manage customer orders, shipping, and fulfillment</p>
          </div>
          <div className="orders-header-actions">
            <button className="btn-secondary" onClick={loadOrders}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              Refresh Orders
            </button>
            <button className="btn-primary" onClick={handleExport}>
              <Download size={16} />
              Export Orders
            </button>
          </div>
        </div>

        <div className="orders-filters">
          <div className="orders-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="orders-date-filter">
            <Calendar size={18} />
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="orders-tabs glass-card">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = grouped[tab.key]?.length || 0;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              className={`order-tab ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              <span className="tab-badge">{count}</span>
              {isActive && (
                <motion.div
                  className="tab-underline"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "confirmed" && (
            <ConfirmedOrdersPage orders={grouped.confirmed} loading={loading} onRefresh={loadOrders} />
          )}
          {activeTab === "shipped" && (
            <ShippedOrdersPage orders={grouped.shipped} loading={loading} onRefresh={loadOrders} />
          )}
          {activeTab === "cancelled" && (
            <CancelledOrdersPage orders={grouped.cancelled} loading={loading} onRefresh={loadOrders} />
          )}
        </motion.div>
      </AnimatePresence>

      {!loading && filteredOrders.length === 0 && (
        <div className="empty-state glass-card">
          <PackageSearch size={48} color="#2962FF" />
          <h3>No Orders Found</h3>
          <p>No orders are currently available.</p>
          <button className="btn-primary" onClick={loadOrders}>
            <RefreshCw size={16} />
            Refresh Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
