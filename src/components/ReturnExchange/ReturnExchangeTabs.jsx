import React from "react";
import { RotateCcw, ArrowLeftRight, ShieldAlert } from "lucide-react";

const ReturnExchangeTabs = ({ activeTab, setActiveTab, counts = { Return: 0, Exchange: 0, Claim: 0 } }) => {
  return (
    <div className="ret-tabs-container">
      <button
        className={`ret-tab ${activeTab === "Return" ? "active" : ""}`}
        onClick={() => setActiveTab("Return")}
      >
        <RotateCcw size={16} />
        Returns
        <span className="ret-tab-badge">{counts.Return}</span>
      </button>
      <button
        className={`ret-tab ${activeTab === "Exchange" ? "active" : ""}`}
        onClick={() => setActiveTab("Exchange")}
      >
        <ArrowLeftRight size={16} />
        Exchanges
        <span className="ret-tab-badge">{counts.Exchange}</span>
      </button>
      <button
        className={`ret-tab ${activeTab === "Claim" ? "active" : ""}`}
        onClick={() => setActiveTab("Claim")}
      >
        <ShieldAlert size={16} />
        Claims
        <span className="ret-tab-badge">{counts.Claim}</span>
      </button>
    </div>
  );
};

export default ReturnExchangeTabs;
