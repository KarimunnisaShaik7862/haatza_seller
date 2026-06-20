import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AreaChart as AreaIcon, LineChart as LineIcon } from "lucide-react";

export default function RevenueChart({ trendReport }) {
  const [chartType, setChartType] = useState("area");

  const currentData = (trendReport || []).map(item => ({
    name: item.date || item.name || "",
    count: item.count || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value" style={{ color: "#2962ff" }}>
            Count: <strong>{payload[0].value.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pi-chart-card">
      <div className="pi-chart-header">
        <div className="pi-chart-title-wrap">
          <h3 className="pi-chart-card-title">Product Traffic Trend</h3>
          <p className="pi-chart-card-subtitle">Performance activities track over dates</p>
        </div>

        <div className="pi-chart-filters">
          <div className="pi-icon-tab-group">
            <button
              className={`pi-icon-btn ${chartType === "area" ? "active" : ""}`}
              onClick={() => setChartType("area")}
              title="Area Chart"
            >
              <AreaIcon size={16} />
            </button>
            <button
              className={`pi-icon-btn ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
              title="Line Chart"
            >
              <LineIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="pi-chart-canvas-wrapper" style={{ width: "100%", height: 320 }}>
        {currentData.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
            No trend report data available
          </div>
        ) : (
          <ResponsiveContainer>
            {chartType === "area" ? (
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2962ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2962ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f6" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2962ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            ) : (
              <LineChart data={currentData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f6" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2962ff"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
