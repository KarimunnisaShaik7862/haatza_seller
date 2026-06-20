// DashboardLayout.js  (updated — added ReviewSubmitPage routes and AuthContext sync)
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { sellerService } from "../../../services/sellerService";
import { getSellerId } from "../../../utils/sellerSession";
import { useAuth } from "../../../context/AuthContext";

import HaatzaNavbar  from "../Navbar/Navbar";
import Sidebar       from "../Sidebar/Sidebar";
import "./DashboardLayout.css";

// ─── Wix image helper ──────────────────────────────────────────────────────────
const resolveLogoUrl = (url) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("wix:image://")) {
    const noScheme = trimmed.replace(/^wix:image:\/\/(?:v1\/)?/, "");
    const fileId = noScheme.split("/")[0].split("#")[0].split("?")[0];
    if (fileId) return `https://static.wixstatic.com/media/${fileId}`;
  }
  if (trimmed.length > 4 && !trimmed.includes(" ")) {
    return `https://static.wixstatic.com/media/${trimmed}`;
  }
  return trimmed;
};

// ─── Read the real seller email from auth sources ─────────────────────────────
const resolveSellerEmail = (locationState) => {
  if (locationState?.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(locationState.email)) {
    const e = locationState.email.trim().toLowerCase();
    console.log("[DashboardLayout] ✅ Email from location.state:", e);
    sessionStorage.setItem("pendingEmail", e);
    localStorage.setItem("userEmail",      e);
    return e;
  }

  const sessionKeys = ["pendingEmail", "userEmail", "email", "sellerEmail"];
  for (const key of sessionKeys) {
    const val = sessionStorage.getItem(key);
    if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      const e = val.trim().toLowerCase();
      console.log(`[DashboardLayout] ✅ Email from sessionStorage[${key}]:`, e);
      return e;
    }
  }

  const localKeys = ["userEmail", "email", "sellerEmail",
                     "user", "authUser", "currentUser", "seller"];
  for (const key of localKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())) {
      const e = raw.trim().toLowerCase();
      console.log(`[DashboardLayout] ✅ Email from localStorage[${key}]:`, e);
      return e;
    }
    try {
      const parsed = JSON.parse(raw);
      const found  = parsed?.email || parsed?.userEmail || parsed?.sellerEmail;
      if (found && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(found)) {
        const e = found.trim().toLowerCase();
        console.log(`[DashboardLayout] ✅ Email from localStorage[${key}].email:`, e);
        return e;
      }
    } catch { /* not JSON */ }
  }

  console.warn("[DashboardLayout] ⚠️ No seller email found in any storage.");
  return "";
};

// ─── Seller display data ───────────────────────────────────────────────────────
const useSellerDisplayData = (resolvedEmail, updateUser, currentUser) => {
  const [loadingProfile, setLoadingProfile] = useState(resolvedEmail ? true : false);
  const fetchedEmailRef = useRef("");

  const updateUserRef = useRef(updateUser);
  const currentUserRef = useRef(currentUser);

  updateUserRef.current = updateUser;
  currentUserRef.current = currentUser;

  useEffect(() => {
    if (!resolvedEmail) {
      setLoadingProfile(false);
      return;
    }

    if (fetchedEmailRef.current === resolvedEmail && currentUserRef.current?.profileFetched) {
      setLoadingProfile(false);
      return;
    }

    fetchedEmailRef.current = resolvedEmail;
    setLoadingProfile(true);

    sellerService.getUserProfile(resolvedEmail)
      .then((res) => {
        console.log("[DashboardLayout] getUserProfile raw response:", JSON.stringify(res, null, 2));
        let p = res?.message || res?.data || res || {};
        if (Array.isArray(p)) {
          p = p[0] || {};
        }
        const actualData = (typeof p === "string") ? (res?.data || res || {}) : p;
        let sellerObj = actualData.seller || actualData.data || actualData;
        if (Array.isArray(sellerObj)) {
          sellerObj = sellerObj[0] || {};
        }
        const foundSellerId = sellerObj.sellerId || sellerObj.seller_id || sellerObj.uid || sellerObj.id || actualData.sellerId || actualData.seller_id || actualData.uid || actualData.id || res?.sellerId || res?.seller_id;
        if (foundSellerId) {
          const sid = String(foundSellerId).trim();
          localStorage.setItem("sellerId", sid);
          sessionStorage.setItem("sellerId", sid);
          localStorage.setItem("__haatza_sellerId", sid);
          sessionStorage.setItem("__haatza_sellerId", sid);
        }
        const resolvedName =
          sellerObj.fullName ||
          (sellerObj.firstName ? (sellerObj.firstName + (sellerObj.lastName ? " " + sellerObj.lastName : "")).trim() : "") ||
          sellerObj.name ||
          sellerObj.nickname ||
          sellerObj.sellerName ||
          actualData.fullName ||
          (actualData.firstName ? (actualData.firstName + (actualData.lastName ? " " + actualData.lastName : "")).trim() : "") ||
          actualData.name ||
          actualData.nickname ||
          actualData.sellerName ||
          "";

        const resolvedCompanyName =
          sellerObj.companyName ||
          sellerObj.company_name ||
          sellerObj.storeName ||
          sellerObj.store_name ||
          sellerObj.tradeName ||
          sellerObj.trade_name ||
          sellerObj.businessName ||
          sellerObj.business_name ||
          actualData.companyName ||
          actualData.company_name ||
          actualData.storeName ||
          actualData.store_name ||
          actualData.tradeName ||
          actualData.trade_name ||
          actualData.businessName ||
          actualData.business_name ||
          "";

        const resolvedPhone =
          sellerObj.phone ||
          sellerObj.phonenumber ||
          sellerObj.phone_number ||
          sellerObj.mobile_number ||
          sellerObj.contact ||
          sellerObj.mobile ||
          actualData.phone ||
          actualData.phonenumber ||
          actualData.phone_number ||
          actualData.mobile_number ||
          actualData.contact ||
          actualData.mobile ||
          "";

        const rawLogo =
          sellerObj.logoUrl ||
          sellerObj.logo ||
          sellerObj.profileImage ||
          sellerObj.profileImg ||
          actualData.logoUrl ||
          actualData.logo ||
          actualData.profileImage ||
          actualData.profileImg ||
          "";

        const resolvedLogoUrl = rawLogo ? resolveLogoUrl(rawLogo) : null;

        const getSellerDataField = (field) => {
          try {
            const sd = JSON.parse(localStorage.getItem("sellerData"));
            return sd?.[field] || "";
          } catch { return ""; }
        };

        const currentContextName =
          getSellerDataField("companyName") ||
          localStorage.getItem("sellerFullName") ||
          sessionStorage.getItem("sellerFullName") ||
          localStorage.getItem("__haatza_sellerName") ||
          sessionStorage.getItem("__haatza_sellerName") ||
          currentUserRef.current?.name ||
          localStorage.getItem("sellerName") ||
          sessionStorage.getItem("sellerName") ||
          "";
        const finalName = (currentContextName && currentContextName !== "Seller")
          ? currentContextName
          : (resolvedName && resolvedName !== "Seller" ? resolvedName : "");

        const currentContextCompanyName = getSellerDataField("companyName") || currentUserRef.current?.companyName || localStorage.getItem("companyName") || sessionStorage.getItem("companyName") || "";
        const finalCompanyName = (currentContextCompanyName && currentContextCompanyName !== "Seller")
          ? currentContextCompanyName
          : (resolvedCompanyName && resolvedCompanyName !== "Seller" ? resolvedCompanyName : finalName);

        const currentContextPhone = getSellerDataField("phone") || currentUserRef.current?.phone || localStorage.getItem("sellerPhone") || sessionStorage.getItem("sellerPhone") || "";
        const finalPhone = resolvedPhone || currentContextPhone || "";

        const finalSellerId = getSellerDataField("sellerId") || foundSellerId || "";
        const finalGstin = getSellerDataField("GSTIN") || getSellerDataField("gstin") || sellerObj.gstin || "";
        const finalAddress = getSellerDataField("address") || sellerObj.address || "";
        const finalPincode = getSellerDataField("pincode") || sellerObj.pincode || sellerObj.pinCode || "";
        const finalStorageType = getSellerDataField("storageType") || sellerObj.storageType || "";
        const finalNickname = getSellerDataField("nickname") || sellerObj.nickname || "";

        updateUserRef.current({
          name: finalName,
          companyName: finalCompanyName,
          email: resolvedEmail,
          phone: finalPhone,
          logoUrl: resolvedLogoUrl || currentUserRef.current?.logoUrl || "",
          profileFetched: true,
          sellerId: finalSellerId,
          GSTIN: finalGstin,
          gstin: finalGstin,
          address: finalAddress,
          pincode: finalPincode,
          storageType: finalStorageType,
          nickname: finalNickname,
          accountManager: sellerObj.accountManager || "",
          bankName: sellerObj.bankName || "",
          accountHolder: sellerObj.accountHolder || "",
          accountNumber: sellerObj.accountNumber || "",
          ifscCode: sellerObj.ifscCode || "",
          panNumber: sellerObj.panNumber || "",
        });
      })
      .catch((err) => {
        console.warn("[DashboardLayout] getUserProfile failed, using fallback display:", err);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [resolvedEmail]);

  return { loadingProfile };
};

// ─── Main Layout ───────────────────────────────────────────────────────────────
function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const sellerEmail = user?.email || resolveSellerEmail(location.state);
  const { loadingProfile }  = useSellerDisplayData(sellerEmail, updateUser, user);

  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSidebarToggle  = () => setSidebarOpen(prev => !prev);
  const handleSidebarClose   = () => { if (isMobile) setSidebarOpen(false); };
  const handleCollapseChange = (collapsed) => setSidebarCollapsed(collapsed);

  const activeSellerId = getSellerId();

  useEffect(() => {
    if (!sellerEmail || (!loadingProfile && !activeSellerId)) {
      navigate("/signin", { replace: true });
    }
  }, [sellerEmail, loadingProfile, activeSellerId, navigate]);

  if (loadingProfile && !activeSellerId) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f5f7ff"
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid #e5e7eb",
          borderTopColor: "#2962ff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!sellerEmail || (!loadingProfile && !activeSellerId)) {
    return null;
  }

  return (
    <div
      className={[
        "app-container",
        sidebarOpen      ? "sidebar-open"      : "",
        sidebarCollapsed ? "sidebar-collapsed" : "",
      ].filter(Boolean).join(" ")}
    >
      <HaatzaNavbar seller={user || {}} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
        sellerName={user?.nickname || user?.name || user?.companyName || ""}
        sellerEmail={user?.email || ""}
        sellerPhone={user?.phone || ""}
        sellerId={user?.sellerId || ""}
        onCollapseChange={handleCollapseChange}
        isMobile={isMobile}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;