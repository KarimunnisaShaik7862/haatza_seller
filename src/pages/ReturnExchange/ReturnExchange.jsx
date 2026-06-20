import React, { useState, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { sellerService } from "../../services/sellerService";
import { useAuth } from "../../context/AuthContext";
import { 
  ReturnExchangeTabs, 
  ReturnExchangeFilters, 
  ReturnExchangeList 
} from "../../components/ReturnExchange";
import "./ReturnExchange.css";

const ReturnExchange = () => {
  const { user } = useAuth();
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Return");

  // Fetch sellerId from storage
  const sellerId = useMemo(() => {
    const canonical = sessionStorage.getItem("__haatza_sellerId") || localStorage.getItem("__haatza_sellerId");
    if (canonical) return canonical;

    try {
      const stored = JSON.parse(localStorage.getItem("haatzaSeller"));
      return user?.sellerId || stored?.sellerId || stored?.data?.sellerId || localStorage.getItem("sellerId") || sessionStorage.getItem("sellerId") || "";
    } catch {
      return user?.sellerId || localStorage.getItem("sellerId") || sessionStorage.getItem("sellerId") || "";
    }
  }, [user]);

  const loadReturns = async () => {
    if (!sellerId) {
      setReturnsList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await sellerService.fetchReturns(sellerId);
      let list = [];
      if (response && response.status === "success") {
        list = response.message?.data || response.data || [];
      }

      // Fetch details for each return item in parallel to enrich them with variant/size info
      const enrichedReturns = await Promise.all(
        list.map(async (item) => {
          try {
            const detailsRes = await sellerService.fetchReturnDetails(item.TableID);
            if (detailsRes && detailsRes.status === "success") {
              const details = detailsRes.message || detailsRes.data || {};
              return {
                ...item,
                productOption: details.productOption || item.productOption
              };
            }
          } catch (err) {
            console.warn(`Failed to enrich return details for TableID ${item.TableID}:`, err);
          }
          return item;
        })
      );

      setReturnsList(enrichedReturns);
    } catch (err) {
      console.error("Error in loadReturns workflow:", err);
      setError("Failed to load return requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  // Filter and group by Tab & Search
  const filteredItems = useMemo(() => {
    let result = [...returnsList];

    // 1. Search Query Filter (Searches by Order ID, Customer Name, or Product Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          String(item.orderId || "").toLowerCase().includes(q) ||
          String(item.customerName || "").toLowerCase().includes(q) ||
          String(item.items || "").toLowerCase().includes(q)
      );
    }

    // 2. Tab Filter
    return result.filter((item) => {
      const status = (item.status || "").toLowerCase();
      if (activeTab === "Exchange") {
        return status.includes("exchange") || status.includes("shipped");
      }
      if (activeTab === "Claim") {
        return status.includes("claim") || status.includes("payout") || status.includes("reimburse");
      }
      // "Return" Tab default fallback
      return !status.includes("exchange") && !status.includes("shipped") && !status.includes("claim");
    });
  }, [returnsList, searchQuery, activeTab]);

  // Count tab elements for badge updates
  const counts = useMemo(() => {
    let returnCount = 0;
    let exchangeCount = 0;
    let claimCount = 0;

    returnsList.forEach((item) => {
      const status = (item.status || "").toLowerCase();
      if (status.includes("exchange") || status.includes("shipped")) {
        exchangeCount++;
      } else if (status.includes("claim") || status.includes("payout") || status.includes("reimburse")) {
        claimCount++;
      } else {
        returnCount++;
      }
    });

    return { Return: returnCount, Exchange: exchangeCount, Claim: claimCount };
  }, [returnsList]);

  return (
    <div className="ret-container">
      {/* Page Header */}
      <div className="ret-header ret-card">
        <div className="ret-title-area">
          <h1>Return / Exchange</h1>
          <p>Manage customer product returns, exchange requests, and claims</p>
        </div>
        
        {/* Controls: Search, Tabs, and Refresh */}
        <div className="ret-controls" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", alignItems: "stretch" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", width: "100%" }}>
            <ReturnExchangeFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <button className="ret-btn ret-btn-secondary" onClick={loadReturns} disabled={loading} style={{ flexShrink: 0 }}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              Refresh
            </button>
          </div>
          
          <ReturnExchangeTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
        </div>
      </div>

      {/* Main List Area */}
      <ReturnExchangeList 
        items={filteredItems} 
        activeTab={activeTab} 
        loading={loading} 
        error={error} 
        refreshAction={loadReturns}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default ReturnExchange;
