import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  Edit2,
  ExternalLink,
  Share2,
  Eye,
} from "lucide-react";
import { resolveSellerEmail } from "../../utils/sellerSession";

// Services and components
import productInsightService from "./services/productInsightService";
import KPISection from "./components/KPISection";
import RevenueChart from "./components/RevenueChart";
import TrafficChart from "./components/TrafficChart";

import "./ProductInsight.css";

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f3f6' rx='8'/%3E%3Ctext x='30' y='35' text-anchor='middle' fill='%23b0b7c3' font-size='22'%3E%F0%9F%93%A6%3C/text%3E%3C/svg%3E";

const getSellerEmail = () => {
  const resolved = resolveSellerEmail();
  if (resolved) return resolved;

  const sessionKeys = ["pendingEmail", "userEmail", "email", "sellerEmail",
                       "user_email", "seller_email", "currentUserEmail"];
  for (const key of sessionKeys) {
    const val = sessionStorage.getItem(key);
    if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return val;
  }

  const localKeys = [
    "userEmail", "email", "sellerEmail", "user_email", "seller_email",
    "user", "authUser", "currentUser", "seller", "userData",
    "sellerData", "auth", "session", "loginData", "accountData",
  ];
  for (const key of localKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())) return raw.trim();
  }
  return "";
};

export default function ProductInsight() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // Load state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Products List State
  const [productsList, setProductsList] = useState([]);

  // Loaded target details and analytics
  const [productDetails, setProductDetails] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Local UI States
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToastMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch list of all products (when tableId is not present in route)
  const fetchAllListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const email = getSellerEmail();
      const listRes = await productInsightService.getSellerProducts(email);
      const list = listRes?.message?.body?.sellerProducts || listRes?.products || listRes?.data || listRes || [];
      setProductsList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading products list:", err);
      setError(err.message || "Unable to load seller listings list.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch details and stats for the selected product (when tableId is present in route)
  const fetchProductAnalytics = useCallback(async (selectedId) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both APIs simultaneously
      const [detailsRes, statsRes] = await Promise.all([
        productInsightService.getProductDetails(selectedId),
        productInsightService.getProductStats(selectedId)
      ]);

      const details = detailsRes?.message?.data || detailsRes?.message || detailsRes?.data || detailsRes;
      if (!details || (!details.name && !details.title)) {
        throw new Error("Product details not found or invalid.");
      }
      setProductDetails(details);

      const stats = statsRes?.message?.data || statsRes?.data || statsRes;
      setAnalyticsData(stats);
    } catch (err) {
      console.error(`Error loading insights for ${selectedId}:`, err);
      setError(err.message || "Unable to load product insights.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tableId) {
      fetchProductAnalytics(tableId);
    } else {
      fetchAllListings();
    }
  }, [tableId, fetchProductAnalytics, fetchAllListings]);

  // Actions
  const handleEditListing = () => {
    if (!tableId) return;
    navigate(`/dashboard/listing/edit/${tableId}/product-info`, {
      state: { origin: "product-insight" },
    });
  };

  const handleViewProduct = () => {
    if (!tableId) return;
    window.open(`https://www.haatza.com/product-page/${tableId}`, "_blank");
  };

  const handleShare = () => {
    const url = `https://www.haatza.com/product-page/${tableId}`;
    navigator.clipboard.writeText(url)
      .then(() => showToastMsg("Product listing link copied to clipboard!", "success"))
      .catch(() => showToastMsg("Failed to copy link.", "error"));
  };

  // Render Loader
  if (loading) {
    return (
      <div className="pi-page-outer">
        <div className="pi-skeleton-header">
          <div className="pi-skeleton-line short" style={{ width: "20%" }} />
          <div className="pi-skeleton-line title" style={{ width: "40%" }} />
        </div>
        <div className="pi-kpi-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pi-kpi-card skeleton-card">
              <div className="pi-skeleton-line short" />
              <div className="pi-skeleton-line medium" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="pi-page-outer">
        <div className="pi-error-card">
          <div className="pi-error-icon-wrap">
            <AlertTriangle size={48} />
          </div>
          <h2 className="pi-error-title">Unable to load product insights</h2>
          <p className="pi-error-desc">{error}</p>
          <div className="pi-error-actions">
            <button className="pi-btn-retry" onClick={() => tableId ? fetchProductAnalytics(tableId) : fetchAllListings()}>
              <RefreshCw size={16} /> Retry
            </button>
            {!tableId ? (
              <button className="pi-btn-back" onClick={() => navigate("/dashboard")}>
                <ArrowLeft size={16} /> Go to Dashboard
              </button>
            ) : (
              <button className="pi-btn-back" onClick={() => navigate("/dashboard/productinsight")}>
                <ArrowLeft size={16} /> Back to Products
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Products List Table (when tableId is not present)
  if (!tableId) {
    return (
      <div className="pi-page-outer">
        {toast.show && <div className="pi-toast">{toast.message}</div>}

        <div className="pi-breadcrumb">
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <ChevronRight size={14} />
          <span className="pi-breadcrumb-active">Product Insight</span>
        </div>

        <div className="pi-table-card">
          <div className="pi-table-header-row">
            <h2 className="pi-table-title">Product Insight Listings</h2>
            <p className="pi-table-subtitle">Select any listing below to analyze detailed product traffic, click rates, and sales conversions.</p>
          </div>

          {productsList.length === 0 ? (
            <div className="pi-error-card" style={{ boxShadow: "none", border: "none", margin: "20px auto" }}>
              <h3 className="pi-error-title">No products found</h3>
              <p className="pi-error-desc">We couldn't retrieve any listings associated with your seller account. Please listing your first product.</p>
            </div>
          ) : (
            <div className="pi-table-responsive">
              <table className="pi-table">
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((product) => {
                    const pid = product.Table_ID || product.tableId || product.id;
                    return (
                      <tr key={pid} className="pi-table-row">
                        <td>
                          <div className="pi-thumbnail-wrap">
                            <img
                              className="pi-thumbnail"
                              src={product.mainmedia || product.productimage || FALLBACK_IMG}
                              alt={product.name || "Product Image"}
                              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                            />
                          </div>
                        </td>
                        <td>
                          <span
                            className="pi-name-link"
                            onClick={() => navigate(`/product-insight/${pid}`)}
                          >
                            {product.name || product.title || product.items || "Untitled Listing"}
                          </span>
                        </td>
                        <td>{product.categoryName || product.subCategory || product.category || "-"}</td>
                        <td>{product.brand || "-"}</td>
                        <td>₹{product.price || product.itemPrice || 0}</td>
                        <td>{product.inventory || product.stock || 0}</td>
                        <td>
                          <span className={`status-badge status-approved`}>
                            {product.status || "Approved"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="pi-btn-action"
                            onClick={() => navigate(`/product-insight/${pid}`)}
                          >
                            <Eye size={13} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check if stats are empty
  const reach = analyticsData?.reach || 0;
  const impression = analyticsData?.impression || 0;
  const clicks = analyticsData?.clicks || 0;
  const sales = analyticsData?.sales || 0;
  const trendReport = analyticsData?.trendReport || [];

  const isEmptyStats = reach === 0 && impression === 0 && clicks === 0 && sales === 0;

  return (
    <div className="pi-page-outer">
      {toast.show && <div className="pi-toast">{toast.message}</div>}

      {/* Header Row */}
      <div className="pi-header-row">
        <div className="pi-breadcrumb">
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <ChevronRight size={14} />
          <span onClick={() => navigate("/dashboard/productinsight")}>Product Insight</span>
          <ChevronRight size={14} />
          <span className="pi-breadcrumb-active">{productDetails?.name || "Product Detail"}</span>
        </div>

        <button className="pi-btn-back" style={{ height: 38 }} onClick={() => navigate("/dashboard/productinsight")}>
          <ArrowLeft size={14} /> All Products
        </button>
      </div>

      {/* Product Overview Section */}
      <div className="pi-product-header-card glass-card">
        <div className="pi-header-main-info">
          <img
            className="pi-header-img"
            src={productDetails?.mainmedia || FALLBACK_IMG}
            alt={productDetails?.name || "Product image"}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
          />
          <div className="pi-header-text-details">
            <h2>{productDetails?.name || productDetails?.title || "Untitled Product"}</h2>
            <div className="pi-header-meta-row">
              <span className="pi-meta-badge">Brand: {productDetails?.brand || "N/A"}</span>
              <span className="pi-meta-badge">Price: ₹{productDetails?.price || 0}</span>
              <span className="pi-meta-badge">Stock: {productDetails?.inventory || 0}</span>
              <span className="pi-meta-badge">Category: {productDetails?.categoryName || productDetails?.subCategory || "N/A"}</span>
              <span className={`status-badge status-approved`}>{productDetails?.status || "Approved"}</span>
            </div>
          </div>
        </div>

        <div className="pi-header-actions-wrap">
          <button className="btn-secondary" onClick={handleEditListing}>
            <Edit2 size={15} /> Edit Listing
          </button>
          <button className="btn-secondary" onClick={handleViewProduct}>
            <ExternalLink size={15} /> View Product
          </button>
          <button className="btn-primary" onClick={handleShare}>
            <Share2 size={15} /> Share Product
          </button>
        </div>
      </div>

      {/* Detailed Analytics OR Empty State */}
      {isEmptyStats ? (
        <div className="pi-error-card">
          <div className="pi-error-icon-wrap" style={{ color: "#64748b", background: "#f1f5f9" }}>
            <AlertTriangle size={48} />
          </div>
          <h2 className="pi-error-title">No analytics available yet</h2>
          <p className="pi-error-desc">There are no traffic, clicks, or sales activities recorded for this product yet.</p>
        </div>
      ) : (
        <div className="pi-sections-container">
          {/* KPI Cards */}
          <KPISection
            reach={reach}
            impression={impression}
            clicks={clicks}
            sales={sales}
          />

          {/* Trend Chart and Traffic Breakdown Donut Chart */}
          <div className="pi-traffic-grid">
            <RevenueChart trendReport={trendReport} />
            <TrafficChart
              reach={reach}
              impression={impression}
              sales={sales}
            />
          </div>
        </div>
      )}
    </div>
  );
}
