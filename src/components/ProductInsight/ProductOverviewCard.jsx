import React from "react";
import { Package, Tag, Boxes, BadgeCheck, Clipboard } from "lucide-react";
import "./ProductOverviewCard.css";

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f3f6' rx='8'/%3E%3Ctext x='30' y='35' text-anchor='middle' fill='%23b0b7c3' font-size='22'%3E%F0%9F%93%A6%3C/text%3E%3C/svg%3E";

const resolveWixImage = (img) => {
  if (!img) return null;
  const raw =
    typeof img === "string"
      ? img
      : img.src || img.url || img.image || img.imageUrl || null;
  if (!raw) return null;
  if (raw.startsWith("data:")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    if (raw.includes("static.wixstatic.com/media/")) {
      const parts = raw.split("static.wixstatic.com/media/");
      if (parts.length > 1) {
        const pathPart = parts[1].split("?")[0].split("#")[0];
        const pathSegments = pathPart.split("/");
        let fileId = pathSegments[0];
        if (pathSegments.length > 1) {
          if (!fileId.includes(".") && pathSegments[1].includes(".")) {
            const ext = pathSegments[1].split(".").pop();
            fileId = `${fileId}.${ext}`;
          }
        }
        return `https://static.wixstatic.com/media/${fileId}`;
      }
    }
    return raw;
  }
  if (raw.startsWith("wix:image://")) {
    const withoutScheme = raw.replace(/^wix:image:\/\//, "");
    const withoutVersion = withoutScheme.replace(/^v1\//, "");
    const hashIdx = withoutVersion.indexOf("#");
    const pathPart = hashIdx !== -1 ? withoutVersion.substring(0, hashIdx) : withoutVersion;
    const pathSegments = pathPart.split("/");
    let fileId = pathSegments[0];
    let fileName = pathSegments[1] || "";
    if (!fileId || fileId.length > 200 || fileId.includes(" ")) return null;
    if (fileId.includes(".")) {
      return `https://static.wixstatic.com/media/${fileId}`;
    }
    if (fileName && fileName.includes(".")) {
      const ext = fileName.split(".").pop();
      return `https://static.wixstatic.com/media/${fileId}.${ext}`;
    }
    return `https://static.wixstatic.com/media/${fileId}~mv2.jpg`;
  }
  return null;
};

const ProductOverviewCard = ({ product, sellerId }) => {
  if (!product) return null;

  const imageUrl = resolveWixImage(product.mainmedia) || FALLBACK_IMG;
  const categories = Array.isArray(product.categoryName)
    ? product.categoryName.join(", ")
    : typeof product.categoryName === "string"
    ? product.categoryName
    : "Uncategorized";

  // Badges Status Config
  const statusStr = (product.status || "").toLowerCase();
  let statusBadgeClass = "pi-badge-pending";
  let statusText = product.status || "Pending";

  if (statusStr === "approved") {
    statusBadgeClass = "pi-badge-approved";
  } else if (statusStr === "rejected") {
    statusBadgeClass = "pi-badge-rejected";
  } else if (statusStr.includes("update") || statusStr.includes("request")) {
    statusBadgeClass = "pi-badge-update";
  }

  // Inventory Status Config
  const qty = Number(product.inventory) || 0;
  let inventoryBadgeClass = "pi-inv-out";
  let inventoryText = "Out of Stock";

  if (qty >= 20) {
    inventoryBadgeClass = "pi-inv-instock";
    inventoryText = "In Stock";
  } else if (qty > 0) {
    inventoryBadgeClass = "pi-inv-low";
    inventoryText = `Low Stock (${qty})`;
  }

  const handleCopyId = (idVal) => {
    if (!idVal) return;
    navigator.clipboard.writeText(idVal);
  };

  return (
    <div className="pi-hero-card">
      <div className="pi-hero-left">
        <img
          className="pi-hero-image"
          src={imageUrl}
          alt={product.name || "Product"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />
      </div>

      <div className="pi-hero-center">
        <div className="pi-hero-meta-row">
          <span className="pi-hero-category">
            <Package size={14} /> {categories}
          </span>
          <span className="pi-hero-brand">
            <BadgeCheck size={14} /> {product.brand || "Generic"}
          </span>
        </div>

        <h1 className="pi-hero-title" title={product.name}>
          {product.name || "Untitled Product"}
        </h1>

        <div className="pi-hero-badges-row">
          <div className={`pi-badge ${statusBadgeClass}`}>
            <span className="pi-badge-dot"></span>
            {statusText}
          </div>
          <div className={`pi-badge ${inventoryBadgeClass}`}>
            <span className="pi-badge-dot"></span>
            {inventoryText}
          </div>
        </div>

        <div className="pi-hero-ids">
          <div className="pi-id-item" onClick={() => handleCopyId(product.productId)}>
            <span className="pi-id-label">Product ID:</span>
            <span className="pi-id-value">{product.productId || "—"}</span>
            <Clipboard size={12} className="pi-id-copy" />
          </div>
          <div className="pi-id-item" onClick={() => handleCopyId(sellerId)}>
            <span className="pi-id-label">Seller ID:</span>
            <span className="pi-id-value">{sellerId || "—"}</span>
            <Clipboard size={12} className="pi-id-copy" />
          </div>
        </div>
      </div>

      <div className="pi-hero-divider"></div>

      <div className="pi-hero-right">
        <div className="pi-metrics-snapshot">
          <div className="pi-metric-item">
            <div className="pi-metric-icon-wrap bg-primary-light">
              <Tag size={20} color="#2962FF" />
            </div>
            <div className="pi-metric-info">
              <span className="pi-metric-label">Selling Price</span>
              <span className="pi-metric-value">₹{Number(product.price || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="pi-metric-item">
            <div className="pi-metric-icon-wrap bg-warning-light">
              <Boxes size={20} color="#FF9800" />
            </div>
            <div className="pi-metric-info">
              <span className="pi-metric-label">Total Stock</span>
              <span className="pi-metric-value">{qty.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverviewCard;
