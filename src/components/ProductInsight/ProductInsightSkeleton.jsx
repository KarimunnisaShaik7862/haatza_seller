import React from "react";
import "./ProductInsightSkeleton.css";

const ProductInsightSkeleton = () => {
  return (
    <div className="pi-skeleton-container">
      {/* Breadcrumb Skeleton */}
      <div className="pi-skel-breadcrumb">
        <div className="pi-skel-shimmer pi-skel-text" style={{ width: 180 }} />
      </div>

      {/* Hero Card Skeleton */}
      <div className="pi-skel-hero">
        <div className="pi-skel-hero-left">
          <div className="pi-skel-shimmer pi-skel-image" />
        </div>
        <div className="pi-skel-hero-center">
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "20%", marginBottom: 12 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "60%", height: 28, marginBottom: 16 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "35%", marginBottom: 12 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "45%" }} />
        </div>
        <div className="pi-skel-hero-right">
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "80%", height: 40, marginBottom: 16 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "70%", height: 40 }} />
        </div>
      </div>

      {/* KPI Cards Skeletons */}
      <div className="pi-skel-kpis">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="pi-skel-kpi-card">
            <div className="pi-skel-kpi-header">
              <div className="pi-skel-shimmer pi-skel-text" style={{ width: 60 }} />
              <div className="pi-skel-shimmer pi-skel-icon" />
            </div>
            <div className="pi-skel-kpi-body">
              <div className="pi-skel-shimmer pi-skel-text" style={{ width: 80, height: 32, marginBottom: 8 }} />
              <div className="pi-skel-shimmer pi-skel-text" style={{ width: "90%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeletons */}
      <div className="pi-skel-charts">
        <div className="pi-skel-chart-card">
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "30%", height: 20, marginBottom: 8 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "50%", marginBottom: 30 }} />
          <div className="pi-skel-shimmer pi-skel-circle" />
        </div>
        <div className="pi-skel-chart-card">
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "30%", height: 20, marginBottom: 8 }} />
          <div className="pi-skel-shimmer pi-skel-text" style={{ width: "50%", marginBottom: 30 }} />
          <div className="pi-skel-shimmer pi-skel-rect" />
        </div>
      </div>
    </div>
  );
};

export default ProductInsightSkeleton;
