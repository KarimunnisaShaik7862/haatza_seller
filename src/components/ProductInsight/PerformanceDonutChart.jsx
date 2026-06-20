import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVertical, HelpCircle } from "lucide-react";
import "./PerformanceDonutChart.css";

const COLORS = ["#2962FF", "#00C853", "#FF6D00"];

const PerformanceDonutChart = ({ reach, impression, sales }) => {
  const [showMenu, setShowMenu] = useState(false);

  const total = (Number(reach) || 0) + (Number(impression) || 0) + (Number(sales) || 0);

  const data = [
    { name: "Viewed", value: Number(reach) || 0 },
    { name: "Interested", value: Number(impression) || 0 },
    { name: "Orders", value: Number(sales) || 0 },
  ].filter(item => item.value > 0);

  // If all values are 0, render a dummy dataset to show empty state representation
  const isEmpty = data.length === 0;
  const chartData = isEmpty
    ? [{ name: "No Engagement", value: 1 }]
    : data;

  const chartColors = isEmpty
    ? ["#E2E8F0"]
    : COLORS;

  return (
    <div className="pi-chart-card">
      <div className="pi-chart-header">
        <div className="pi-chart-title-wrap">
          <h3 className="pi-chart-title">Product Engagement</h3>
          <p className="pi-chart-subtitle">Breakdown of customer activity in this period</p>
        </div>
        <div className="pi-chart-actions">
          <button className="pi-chart-action-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="pi-chart-menu">
              <button onClick={() => { setShowMenu(false); alert("Engagement metrics represent your product visibility conversion rates."); }}>
                <HelpCircle size={14} /> Explain Metrics
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pi-donut-container">
        <div className="pi-donut-chart-wrap">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={isEmpty ? 0 : 3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              {!isEmpty && (
                <Tooltip
                  formatter={(value) => [value, "Engagement"]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

          <div className="pi-donut-center">
            <span className="pi-donut-number">{total.toLocaleString()}</span>
            <span className="pi-donut-label">Total Engagement</span>
          </div>
        </div>

        <div className="pi-donut-legend">
          <div className="pi-legend-item">
            <span className="pi-legend-bullet bullet-viewed"></span>
            <div className="pi-legend-info">
              <span className="pi-legend-label">Viewed</span>
              <span className="pi-legend-val">{(Number(reach) || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="pi-legend-item">
            <span className="pi-legend-bullet bullet-interested"></span>
            <div className="pi-legend-info">
              <span className="pi-legend-label">Interested</span>
              <span className="pi-legend-val">{(Number(impression) || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="pi-legend-item">
            <span className="pi-legend-bullet bullet-orders"></span>
            <div className="pi-legend-info">
              <span className="pi-legend-label">Orders</span>
              <span className="pi-legend-val">{(Number(sales) || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDonutChart;
