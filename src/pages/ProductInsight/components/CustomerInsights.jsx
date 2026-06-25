import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";

export default function CustomerInsights({ customer }) {
  if (!customer) return null;

  const { avgRating, distribution, reviewSummary } = customer;

  return (
    <div className="pi-customer-grid">
      {/* 1. Star Rating Distribution Chart */}
      <div className="pi-chart-card">
        <h3 className="pi-chart-card-title">Customer Ratings Overview</h3>
        <p className="pi-chart-card-subtitle">Distribution of star ratings given by verified buyers</p>

        <div className="pi-ratings-flex">
          {/* Large Average Score display */}
          <div className="pi-ratings-summary-block">
            <h4 className="pi-rating-large-score">{avgRating}</h4>
            <div className="pi-rating-stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(avgRating) ? "#f59e0b" : "none"}
                  stroke={i < Math.floor(avgRating) ? "#f59e0b" : "#cbd5e1"}
                />
              ))}
            </div>
            <p className="pi-rating-stars-sub text-slate">out of 5 stars</p>
          </div>

          {/* Recharts Bar Chart */}
          <div className="pi-ratings-chart-wrapper" style={{ flex: 1, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={distribution}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="star"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" radius={4} barSize={8}>
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f59e0b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Review Summary Card */}
      <div className="pi-chart-card pi-review-summary-card">
        <div className="pi-review-summary-header">
          <MessageSquare size={20} className="text-blue" />
          <h3 className="pi-chart-card-title" style={{ margin: 0 }}>Review Summary</h3>
        </div>
        <div className="pi-review-quote-wrapper">
          <span className="quote-mark">“</span>
          <p className="pi-review-quote">{reviewSummary}</p>
          <span className="quote-mark text-right">”</span>
        </div>
        <div className="pi-review-meta">
          <span className="pi-badge-green">AI-Generated Summary</span>
          <span className="text-slate">Updated daily</span>
        </div>
      </div>
    </div>
  );
}
