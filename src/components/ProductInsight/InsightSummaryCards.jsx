import React, { useState, useEffect } from "react";
import { Eye, Users, MousePointerClick, ShoppingCart } from "lucide-react";
import "./InsightSummaryCards.css";

// Reusable CountUp component
export const AnimatedCount = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;

    if (endValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};

const InsightSummaryCards = ({ stats }) => {
  const data = stats || {};

  const cards = [
    {
      id: "viewed",
      title: "Viewed",
      value: data.reach || 0,
      description: "Unique views on search & category pages",
      icon: <Eye size={22} />,
      colorClass: "pi-kpi-blue",
    },
    {
      id: "interested",
      title: "Interested",
      value: data.impression || 0,
      description: "Product page views & detailing actions",
      icon: <Users size={22} />,
      colorClass: "pi-kpi-green",
    },
    {
      id: "clicks",
      title: "Clicks",
      value: data.clicks || 0,
      description: "Clicks on product cards & media elements",
      icon: <MousePointerClick size={22} />,
      colorClass: "pi-kpi-orange",
    },
    {
      id: "orders",
      title: "Orders",
      value: data.sales || 0,
      description: "Successfully placed orders in period",
      icon: <ShoppingCart size={22} />,
      colorClass: "pi-kpi-red",
    },
  ];

  return (
    <div className="pi-kpi-grid">
      {cards.map((card) => (
        <div key={card.id} className={`pi-kpi-card ${card.colorClass}`}>
          <div className="pi-kpi-header">
            <span className="pi-kpi-title">{card.title}</span>
            <div className="pi-kpi-icon-container">{card.icon}</div>
          </div>

          <div className="pi-kpi-body">
            <span className="pi-kpi-value">
              <AnimatedCount value={card.value} />
            </span>
            <p className="pi-kpi-desc">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightSummaryCards;
