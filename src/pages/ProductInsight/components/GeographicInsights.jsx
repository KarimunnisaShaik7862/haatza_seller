import React from "react";
import { MapPin } from "lucide-react";

export default function GeographicInsights({ geographic }) {
  if (!geographic) return null;

  return (
    <div className="pi-chart-card">
      <h3 className="pi-chart-card-title">Top Performing States</h3>
      <p className="pi-chart-card-subtitle">Sales contribution from primary states</p>

      <div className="pi-geo-list">
        {geographic.map((geo, idx) => (
          <div key={idx} className="pi-geo-row">
            <div className="pi-geo-header">
              <div className="pi-geo-state">
                <MapPin size={16} className="text-blue" />
                <span>{geo.state}</span>
              </div>
              <div className="pi-geo-metrics">
                <span>Revenue: <strong>{geo.revenuePct}%</strong></span>
                <span className="divider">|</span>
                <span>Orders: <strong>{geo.ordersPct}%</strong></span>
              </div>
            </div>
            
            {/* Double progress bar representing revenue contribution */}
            <div className="pi-geo-progress-track">
              <div
                className="pi-geo-progress-fill"
                style={{ width: `${geo.revenuePct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
