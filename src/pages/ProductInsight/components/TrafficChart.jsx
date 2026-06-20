import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2962ff", "#10b981", "#6366f1"];

export default function TrafficChart({ reach, impression, sales }) {
  const data = [
    { name: "Viewed", value: reach || 0 },
    { name: "Interested", value: impression || 0 },
    { name: "Orders", value: sales || 0 },
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
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
