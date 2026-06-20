import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    // Primary source of truth: sellerData
    const sellerDataRaw = localStorage.getItem("sellerData");
    if (sellerDataRaw) {
      try {
        const sd = JSON.parse(sellerDataRaw);
        if (sd) {
          return {
            ...sd,
            name: sd.companyName || sd.name || "",
            companyName: sd.companyName || sd.name || "",
            email: sd.email || "",
            phone: sd.phone || "",
            sellerId: sd.sellerId || "",
            gstin: sd.GSTIN || sd.gstin || "",
            GSTIN: sd.GSTIN || sd.gstin || "",
            address: sd.address || "",
            pincode: sd.pincode || "",
            nickname: sd.nickname || "",
            storageType: sd.storageType || "",
          };
        }
      } catch (e) {}
    }

    const KEY = "haatza_user";
    let u = sessionStorage.getItem(KEY);
    if (!u) {
      u = localStorage.getItem(KEY);
    }
    if (u) {
      try {
        return JSON.parse(u);
      } catch (e) {
        return null;
      }
    }
    // Legacy fallbacks
    const legacyName = sessionStorage.getItem("sellerName") || localStorage.getItem("sellerName");
    const legacyCompanyName = sessionStorage.getItem("companyName") || localStorage.getItem("companyName");
    const legacyEmail = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || sessionStorage.getItem("pendingEmail");
    const legacyPhone = sessionStorage.getItem("sellerPhone") || localStorage.getItem("sellerPhone") || sessionStorage.getItem("pendingPhone");
    const legacyLogoUrl = sessionStorage.getItem("sellerLogoUrl") || localStorage.getItem("sellerLogoUrl");
    if (legacyName || legacyCompanyName || legacyEmail || legacyPhone) {
      return {
        name: legacyName || "",
        companyName: legacyCompanyName || legacyName || "",
        email: legacyEmail || "",
        phone: legacyPhone || "",
        logoUrl: legacyLogoUrl || "",
      };
    }
    return null;
  });

  const updateUser = useCallback((newDetails) => {
    setUser((prev) => {
      const mergedName = (newDetails.name && newDetails.name !== "Seller")
        ? newDetails.name
        : (prev?.name && prev?.name !== "Seller" ? prev.name : (newDetails.name || prev?.name || ""));

      const mergedCompanyName = (newDetails.companyName && newDetails.companyName !== "Seller")
        ? newDetails.companyName
        : (prev?.companyName && prev?.companyName !== "Seller" ? prev.companyName : (newDetails.companyName || prev?.companyName || ""));

      const merged = {
        name: mergedName,
        companyName: mergedCompanyName,
        email: "",
        phone: "",
        logoUrl: "",
        ...prev,
        ...newDetails,
        name: mergedName,
        companyName: mergedCompanyName,
      };

      const KEY = "haatza_user";
      sessionStorage.setItem(KEY, JSON.stringify(merged));
      localStorage.setItem(KEY, JSON.stringify(merged));

      // Keep legacy individual keys in sync for compatibility
      if (merged.name && merged.name !== "Seller") {
        sessionStorage.setItem("sellerName", merged.name);
        localStorage.setItem("sellerName", merged.name);
      }
      if (merged.companyName && merged.companyName !== "Seller") {
        sessionStorage.setItem("companyName", merged.companyName);
        localStorage.setItem("companyName", merged.companyName);
      }
      if (merged.email) {
        sessionStorage.setItem("userEmail", merged.email);
        localStorage.setItem("userEmail", merged.email);
        sessionStorage.setItem("pendingEmail", merged.email);
      }
      if (merged.phone) {
        sessionStorage.setItem("sellerPhone", merged.phone);
        localStorage.setItem("sellerPhone", merged.phone);
      }
      if (merged.logoUrl) {
        sessionStorage.setItem("sellerLogoUrl", merged.logoUrl);
        localStorage.setItem("sellerLogoUrl", merged.logoUrl);
      }

      // Keep sellerData in sync
      const currentSellerDataRaw = localStorage.getItem("sellerData");
      let currentSd = {};
      if (currentSellerDataRaw) {
        try { currentSd = JSON.parse(currentSellerDataRaw); } catch {}
      }
      const updatedSd = {
        ...currentSd,
        ...newDetails,
        companyName: merged.companyName,
        email: merged.email,
        phone: merged.phone,
        sellerId: merged.sellerId,
        GSTIN: merged.GSTIN || merged.gstin || currentSd.GSTIN || "",
        gstin: merged.GSTIN || merged.gstin || currentSd.GSTIN || "",
        address: merged.address || currentSd.address || "",
        pincode: merged.pincode || currentSd.pincode || "",
        nickname: merged.nickname || currentSd.nickname || "",
        storageType: merged.storageType || currentSd.storageType || "Seller",
      };
      localStorage.setItem("sellerData", JSON.stringify(updatedSd));

      return merged;
    });
  }, []);

  const login = useCallback((userData) => {
    updateUser(userData);
  }, [updateUser]);

  const logout = useCallback(() => {
    setUser(null);
    const KEY = "haatza_user";
    localStorage.removeItem("sellerData");
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
    sessionStorage.removeItem("pendingEmail");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("sellerName");
    localStorage.removeItem("sellerName");
    sessionStorage.removeItem("sellerPhone");
    localStorage.removeItem("sellerPhone");
    sessionStorage.removeItem("sellerLogoUrl");
    localStorage.removeItem("sellerLogoUrl");
    
    // Additional keys to clear
    sessionStorage.removeItem("haatzaSeller");
    localStorage.removeItem("haatzaSeller");
    sessionStorage.removeItem("companyName");
    localStorage.removeItem("companyName");
    sessionStorage.removeItem("sellerId");
    localStorage.removeItem("sellerId");
    sessionStorage.removeItem("__haatza_sellerId");
    localStorage.removeItem("__haatza_sellerId");
    sessionStorage.removeItem("__haatza_sellerEmail");
    localStorage.removeItem("__haatza_sellerEmail");
    sessionStorage.removeItem("__haatza_sellerPhone");
    localStorage.removeItem("__haatza_sellerPhone");
    sessionStorage.removeItem("__haatza_sellerName");
    localStorage.removeItem("__haatza_sellerName");
  }, []);

  // Synchronize across multiple open tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "haatza_user") {
        if (!e.newValue) {
          setUser(null);
        } else {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {}
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
