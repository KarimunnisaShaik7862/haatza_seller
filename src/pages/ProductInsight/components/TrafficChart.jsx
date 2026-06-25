import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function TrafficChart({ reach, impression, clicks, sales }) {
  const data = [
    { name: "Viewed", value: reach || 0, color: "#2962ff" },
    { name: "Interested", value: impression || 0, color: "#10b981" },
    { name: "Clicks", value: clicks || 0, color: "#6366f1" },
    { name: "Orders", value: sales || 0, color: "#b91c1c" },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value" style={{ color: payload[0].payload.color || "#2962ff" }}>
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
        <div>
          <h3 className="pi-chart-card-title">Activity Breakdown</h3>
          <p className="pi-chart-card-subtitle">Distribution of user actions for this product</p>
        </div>
      </div>

      <div className="pi-chart-canvas-wrapper" style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {data.length === 0 ? (
          <div style={{ color: "#64748b" }}>No traffic data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                minAngle={15}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
