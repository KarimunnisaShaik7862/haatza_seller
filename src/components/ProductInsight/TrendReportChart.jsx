import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical, HelpCircle } from "lucide-react";
import "./TrendReportChart.css";

const TrendReportChart = ({ trendReport }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Format data
  const data = Array.isArray(trendReport)
    ? trendReport.map(item => {
        // Formats "2026-06-09" to "09 Jun"
        let formattedDate = item.date;
        try {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj)) {
            const day = String(dateObj.getDate()).padStart(2, "0");
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[dateObj.getMonth()];
            formattedDate = `${day} ${month}`;
          }
        } catch {
          // Fallback
        }
        return {
          date: formattedDate,
          count: item.count || 0,
        };
      })
    : [];

  return (
    <div className="pi-chart-card">
      <div className="pi-chart-header">
        <div className="pi-chart-title-wrap">
          <h3 className="pi-chart-title">Traffic Trend Report</h3>
          <p className="pi-chart-subtitle">Daily unique interactions over the last 7 days</p>
        </div>
        <div className="pi-chart-actions">
          <button className="pi-chart-action-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="pi-chart-menu">
              <button onClick={() => { setShowMenu(false); alert("This chart shows unique customer reach over time."); }}>
                <HelpCircle size={14} /> View Analytics Help
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pi-trend-scroll-container">
        <div className="pi-trend-chart-inner">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2962FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  fontFamily: "inherit"
                }}
                labelStyle={{ fontWeight: 600, color: "#1A1A1A" }}
                itemStyle={{ color: "#2962FF" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2962FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#2962FF" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendReportChart;
