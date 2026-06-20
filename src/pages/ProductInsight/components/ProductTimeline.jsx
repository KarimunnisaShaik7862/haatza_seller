import React from "react";
import { PlusCircle, RefreshCw, DollarSign, Megaphone, ShoppingCart, RotateCcw } from "lucide-react";

export default function ProductTimeline({ timeline }) {
  if (!timeline) return null;

  const getTimelineIcon = (type) => {
    switch (type) {
      case "Order":
        return { icon: ShoppingCart, color: "blue" };
      case "Inventory":
        return { icon: RefreshCw, color: "green" };
      case "Price":
        return { icon: DollarSign, color: "purple" };
      case "Promotion":
        return { icon: Megaphone, color: "indigo" };
      case "Return":
        return { icon: RotateCcw, color: "rose" };
      default:
        return { icon: PlusCircle, color: "slate" };
    }
  };

  return (
    <div className="pi-chart-card">
      <h3 className="pi-chart-card-title">Product Timeline</h3>
      <p className="pi-chart-card-subtitle">Milestones and activity trace in catalog history</p>

      <div className="pi-timeline-wrapper">
        {timeline.map((item, idx) => {
          const { icon: Icon, color } = getTimelineIcon(item.type);
          return (
            <div key={idx} className="pi-timeline-item">
              {/* Timeline Connector Line */}
              {idx < timeline.length - 1 && <div className="pi-timeline-connector" />}
              
              {/* Timeline Icon Node */}
              <div className={`pi-timeline-icon-wrap icon-${color}`}>
                <Icon size={14} />
              </div>
              
              {/* Timeline Details */}
              <div className="pi-timeline-content">
                <div className="pi-timeline-meta">
                  <span className="pi-timeline-type text-slate">{item.type}</span>
                  <span className="pi-timeline-date">{item.date}</span>
                </div>
                <p className="pi-timeline-text">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
