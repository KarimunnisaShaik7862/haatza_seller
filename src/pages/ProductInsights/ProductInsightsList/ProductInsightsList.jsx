import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, ChevronRight, Eye } from "lucide-react";
import { resolveSellerEmail } from "../../../utils/sellerSession";
import { fetchSellerListings, getProductDetails } from "../../../services/sellerService";
import "./ProductInsightsList.css";

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

const computeFinalPrice = (price, discount) => {
  const numPrice = Number(price) || 0;
  if (!discount?.type || discount.value == null) return numPrice;
  if (discount.type === "AMOUNT")     return Math.max(0, numPrice - discount.value);
  if (discount.type === "PERCENTAGE") return Math.max(0, numPrice - (numPrice * discount.value) / 100);
  return numPrice;
};

const getCategoryName = (product) => {
  if (typeof product.categoryName === "string" && product.categoryName) return product.categoryName;
  if (product.category) {
    if (typeof product.category === "object") return product.category.name || product.category.title || "";
    if (typeof product.category === "string") return product.category;
  }
  if (product.subCategory) {
    if (typeof product.subCategory === "object") return product.subCategory.name || product.subCategory.title || "";
    if (typeof product.subCategory === "string") return product.subCategory;
  }
  return "";
};

const getBrandName = (product) => {
  if (product.brand) {
    if (typeof product.brand === "object") return product.brand.name || product.brand.title || "";
    if (typeof product.brand === "string") return product.brand;
  }
  return "";
};

export default function ProductInsightsList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsList, setProductsList] = useState([]);

  const fetchAllListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const email = getSellerEmail();
      const listRes = await fetchSellerListings({ email, page: 1, limit: 100, type: "mylisting" });
      const list = listRes?.products || [];

      // Fetch details for all products in parallel to resolve actual Category and Brand
      const productsWithDetails = await Promise.all(
        list.map(async (product) => {
          try {
            const pid = product.Table_ID || product.tableId || product.id;
            const detailsRes = await getProductDetails(pid);
            const candidates = [
              detailsRes?.message?.body?.product,
              detailsRes?.message?.body,
              detailsRes?.body?.product,
              detailsRes?.body,
              detailsRes?.message?.data,
              detailsRes?.message,
              detailsRes?.data,
              detailsRes
            ];
            const details = candidates.find(
              (c) =>
                c &&
                typeof c === "object" &&
                !Array.isArray(c) &&
                (c.name || c.price != null || c.status || c.Table_ID)
            ) ?? detailsRes;

            return {
              ...product,
              brand: details?.brand || product.brand || "",
              categoryName: details?.categoryName || details?.category || details?.subCategory || product.categoryName || ""
            };
          } catch (e) {
            console.error("Error fetching details for product in list:", e);
            return product;
          }
        })
      );

      setProductsList(productsWithDetails);
    } catch (err) {
      console.error("Error loading products list:", err);
      setError(err.message || "Unable to load seller listings list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  // Set document title for SEO
  useEffect(() => {
    document.title = "Product Insights - Seller Portal";
  }, []);

  if (loading) {
    return (
      <div className="pi-page-outer" id="product-insights-list-loading">
        <div className="pi-skeleton-header">
          <div className="pi-skeleton-line short" style={{ width: "20%" }} />
          <div className="pi-skeleton-line title" style={{ width: "40%" }} />
        </div>
        <div className="pi-table-skeleton-card">
          <div className="pi-skeleton-line medium" style={{ height: "40px", marginBottom: "20px" }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="pi-skeleton-row">
              <div className="pi-skeleton-line short" style={{ width: "10%" }} />
              <div className="pi-skeleton-line medium" style={{ width: "30%" }} />
              <div className="pi-skeleton-line short" style={{ width: "20%" }} />
              <div className="pi-skeleton-line short" style={{ width: "15%" }} />
              <div className="pi-skeleton-line short" style={{ width: "10%" }} />
              <div className="pi-skeleton-line short" style={{ width: "15%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pi-page-outer" id="product-insights-list-error">
        <div className="pi-error-card">
          <div className="pi-error-icon-wrap">
            <AlertTriangle size={48} />
          </div>
          <h2 className="pi-error-title">Unable to load product insights</h2>
          <p className="pi-error-desc">{error}</p>
          <div className="pi-error-actions">
            <button className="pi-btn-retry" onClick={fetchAllListings}>
              <RefreshCw size={16} /> Retry
            </button>
            <button className="pi-btn-back" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pi-page-outer" id="product-insights-list-page">
      <div className="pi-breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        <ChevronRight size={14} />
        <span className="pi-breadcrumb-active">Product Insight</span>
      </div>

      <div className="pi-table-card">
        <div className="pi-table-header-row">
          <h1 className="pi-table-title" id="main-insights-title">Product Insight Listings</h1>
          <p className="pi-table-subtitle">Select any listing below to analyze detailed product traffic, views, and sales conversions.</p>
        </div>

        {productsList.length === 0 ? (
          <div className="pi-error-card" style={{ boxShadow: "none", border: "none", margin: "20px auto" }}>
            <h3 className="pi-error-title">No products found</h3>
            <p className="pi-error-desc">We couldn't retrieve any listings associated with your seller account. Please list your first product.</p>
          </div>
        ) : (
          <div className="pi-table-responsive">
            <table className="pi-table" id="products-insights-table">
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Final Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => {
                  const pid = product.Table_ID || product.tableId || product.id;
                  const finalPrice = computeFinalPrice(product.price, product.discount);
                  const displayCategory = getCategoryName(product);
                  const displayBrand = getBrandName(product);
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
                      <td>{displayCategory}</td>
                      <td>{displayBrand}</td>
                      <td>₹{finalPrice.toFixed(2)}</td>
                      <td>
                        <span className="status-badge status-approved">
                          {product.status || "Approved"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="pi-btn-action"
                          id={`view-details-${pid}`}
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
