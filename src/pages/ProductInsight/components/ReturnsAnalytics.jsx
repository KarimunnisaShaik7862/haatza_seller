import React from "react";
import { ArrowUpDown, RefreshCw, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const REASON_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#64748b"];

export default function ReturnsAnalytics({ returns }) {
  if (!returns) return null;

  const { returnPct, refundPct, reasons } = returns;

  return (
    <div className="pi-returns-grid">
      {/* KPI Stats Column */}
      <div className="pi-chart-card pi-returns-stats-card">
        <h3 className="pi-chart-card-title">Returns & Refunds</h3>
        <p className="pi-chart-card-subtitle">Performance indicators on return actions</p>

        <div className="pi-returns-kpis">
          <div className="pi-ret-kpi-row">
            <div className="pi-ret-kpi-item">
              <span className="pi-ret-kpi-lbl">Return Percentage</span>
              <h4>{returnPct}%</h4>
            </div>
            <ArrowUpDown size={20} className="text-rose" />
          </div>

          <div className="pi-ret-kpi-row">
            <div className="pi-ret-kpi-item">
              <span className="pi-ret-kpi-lbl">Refund Percentage</span>
              <h4>{refundPct}%</h4>
            </div>
            <RefreshCw size={20} className="text-amber" />
          </div>

          <div className="pi-ret-alert-box">
            <AlertTriangle size={18} className="text-amber" />
            <p>Size issues contribute to the majority of return requests. Adjust specification chart details.</p>
          </div>
        </div>
      </div>

      {/* Chart Column */}
      <div className="pi-chart-card">
        <h3 className="pi-chart-card-title">Top Return Reasons</h3>
        <p className="pi-chart-card-subtitle">Primary complaints registered during claims</p>
        
        <div style={{ width: "100%", height: 200, marginTop: 12 }}>
          <ResponsiveContainer>
            <BarChart data={reasons} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f6" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={25}>
                {reasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={REASON_COLORS[index % REASON_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
