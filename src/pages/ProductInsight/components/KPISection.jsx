import React from "react";
import { Eye, Users, MousePointerClick, ShoppingBag } from "lucide-react";

export default function KPISection({ reach, impression, clicks, sales }) {
  const cards = [
    {
      title: "Viewed",
      value: (reach || 0).toLocaleString(),
      icon: Eye,
      color: "blue",
    },
    {
      title: "Interested",
      value: (impression || 0).toLocaleString(),
      icon: Users,
      color: "green",
    },
    {
      title: "Clicks",
      value: (clicks || 0).toLocaleString(),
      icon: MousePointerClick,
      color: "purple",
    },
    {
      title: "Orders",
      value: (sales || 0).toLocaleString(),
      icon: ShoppingBag,
      color: "indigo",
    },
  ];

  return (
    <div className="pi-kpi-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="pi-kpi-card">
            <div className="pi-kpi-header">
              <span className="pi-kpi-title">{card.title}</span>
              <span className={`pi-kpi-icon-wrap icon-${card.color}`}>
                <Icon size={20} />
              </span>
            </div>
            <div className="pi-kpi-body">
              <h3 className="pi-kpi-value">{card.value}</h3>
              <span className="pi-kpi-muted" style={{ fontSize: 11 }}>Active Product Actions</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
