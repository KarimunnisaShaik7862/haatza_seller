import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2 } from "lucide-react";
import "./EmptyAnalyticsState.css";

const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="pi-empty-card">
      <div className="pi-empty-illustration-wrap">
        <div className="pi-empty-circle bg-glow">
          <BarChart2 size={40} className="pi-empty-icon" />
          <div className="pi-empty-dotted-line line-1"></div>
          <div className="pi-empty-dotted-line line-2"></div>
        </div>
      </div>

      <h2 className="pi-empty-title">No analytics available yet</h2>
      <p className="pi-empty-subtitle">
        This product hasn't recorded customer interactions (views, clicks, or sales) in the selected time window. Customer activity will appear here as soon as customers discover this product.
      </p>

      <button className="pi-empty-btn" onClick={() => navigate("/dashboard/my-listings")}>
        <ArrowLeft size={16} /> Back To Listings
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
