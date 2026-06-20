import React from "react";
import { Package, ShieldAlert, AlertCircle, Clock } from "lucide-react";

export default function InventoryInsights({ inventory }) {
  if (!inventory) return null;

  const { currentStock, reservedStock, lowStockThreshold, outOfStockDays } = inventory;
  const isLowStock = currentStock <= lowStockThreshold;
  const totalStock = currentStock + reservedStock;
  const reservedPercentage = totalStock > 0 ? Math.round((reservedStock / totalStock) * 100) : 0;

  return (
    <div className="pi-inventory-card-section">
      <div className="pi-chart-card">
        <h3 className="pi-chart-card-title">Inventory Insights</h3>
        <p className="pi-chart-card-subtitle">Real-time stock status and alerts</p>

        <div className="pi-inventory-grid">
          {/* Card 1: Current Stock */}
          <div className="pi-inv-cell">
            <div className="pi-inv-cell-header">
              <span className="pi-inv-lbl">Current Stock</span>
              <Package size={18} className="text-blue" />
            </div>
            <div className="pi-inv-cell-body">
              <h4>{currentStock} units</h4>
              <span className={`pi-inv-badge ${isLowStock ? "badge-warning" : "badge-success"}`}>
                {isLowStock ? "Low Stock" : "In Stock"}
              </span>
            </div>
            {/* Progress bar representing remaining capacity */}
            <div className="pi-inv-progress-bar">
              <div
                className={`pi-inv-progress-fill ${isLowStock ? "fill-warning" : "fill-blue"}`}
                style={{ width: `${Math.min(100, (currentStock / 200) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Reserved Stock */}
          <div className="pi-inv-cell">
            <div className="pi-inv-cell-header">
              <span className="pi-inv-lbl">Reserved Stock</span>
              <AlertCircle size={18} className="text-purple" />
            </div>
            <div className="pi-inv-cell-body">
              <h4>{reservedStock} units</h4>
              <span className="pi-inv-badge badge-neutral">{reservedPercentage}% reserved</span>
            </div>
            <div className="pi-inv-progress-bar">
              <div
                className="pi-inv-progress-fill fill-purple"
                style={{ width: `${reservedPercentage}%` }}
              />
            </div>
          </div>

          {/* Card 3: Low Stock Alert */}
          <div className="pi-inv-cell">
            <div className="pi-inv-cell-header">
              <span className="pi-inv-lbl">Low Stock Alert</span>
              <ShieldAlert size={18} className={isLowStock ? "text-rose" : "text-slate"} />
            </div>
            <div className="pi-inv-cell-body">
              <h4>Threshold: {lowStockThreshold}</h4>
              <span className={`pi-inv-badge ${isLowStock ? "badge-danger" : "badge-success"}`}>
                {isLowStock ? "Action Required" : "Stock Levels Healthy"}
              </span>
            </div>
          </div>

          {/* Card 4: Out Of Stock Days */}
          <div className="pi-inv-cell">
            <div className="pi-inv-cell-header">
              <span className="pi-inv-lbl">Out of Stock Days</span>
              <Clock size={18} className="text-amber" />
            </div>
            <div className="pi-inv-cell-body">
              <h4>{outOfStockDays} Days</h4>
              <span className="pi-inv-badge badge-neutral">In last 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
