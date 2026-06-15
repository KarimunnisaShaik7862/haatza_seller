const ONBOARD_STATUS_API_URL =
  "https://www.haatzaseller.com/_functions/onboardStatus";

export async function checkOnboardStatus(contact) {
  if (!contact) {
    throw new Error("checkOnboardStatus: contact is required.");
  }

  const trimmed = contact.trim();

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isPhone = /^[6-9]\d{9}$/.test(trimmed);

  let queryParam = "";

  if (isEmail) {
    queryParam = `email=${encodeURIComponent(trimmed)}`;
  } else if (isPhone) {
    queryParam = `phone=${encodeURIComponent(trimmed)}`;
  } else {
    throw new Error("Invalid email or phone number.");
  }

  const url = `${ONBOARD_STATUS_API_URL}?${queryParam}`;

  // Always log before fetch so a 400 is immediately diagnosable
  console.log("checkOnboardStatus — contact:", JSON.stringify(trimmed));
  console.log("checkOnboardStatus — detected as:", isEmail ? "email" : isPhone ? "phone" : "UNKNOWN");
  console.log("checkOnboardStatus — calling URL:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Onboard status API error: ${res.status} ${res.statusText}`
    );
  }


  const data = await res.json();
  console.log("RAW Onboard API Response:", JSON.stringify(data)); // ADD THIS

  // ─── Cache sellerId if present in response ───────────────────────────
  try {
    const sellerObj = data?.message?.seller || data?.seller || data?.message || data || {};
    if (sellerObj && typeof sellerObj === 'object') {
      const resolvedSellerId =
        sellerObj.sellerId ||
        sellerObj.seller_id ||
        sellerObj._id ||
        sellerObj.id ||
        sellerObj.uid ||
        sellerObj.SellerID ||
        sellerObj.Seller_ID ||
        data?.message?.sellerId ||
        data?.message?.seller_id ||
        data?.sellerId ||
        data?.seller_id ||
        data?.SellerID ||
        "";
      if (resolvedSellerId && String(resolvedSellerId).trim().length > 2) {
        const sid = String(resolvedSellerId).trim();
        localStorage.setItem("sellerId", sid);
        sessionStorage.setItem("sellerId", sid);
        localStorage.setItem("__haatza_sellerId", sid);
        sessionStorage.setItem("__haatza_sellerId", sid);
        console.log("[OnboardStatusApi] ✅ Extracted and cached sellerId:", sid);
      }
    }
  } catch (err) {
    console.warn("[OnboardStatusApi] Failed to extract and cache sellerId:", err);
  }

  // ─── Cache seller name if present in response ───────────────────────────
  try {
    const sellerObj = data?.message?.seller || data?.seller || data?.message || data || {};
    if (sellerObj && typeof sellerObj === 'object') {
      const nameVal = sellerObj.fullName || sellerObj.name || sellerObj.companyName || sellerObj.tradeName;
      if (nameVal && typeof nameVal === 'string' && nameVal.trim()) {
        const cleanedName = nameVal.trim();
        localStorage.setItem("sellerName", cleanedName);
        sessionStorage.setItem("sellerName", cleanedName);
        console.log("[OnboardStatusApi] ✅ Extracted and cached sellerName:", cleanedName);
      }
    }
  } catch (err) {
    console.warn("[OnboardStatusApi] Failed to extract seller name:", err);
  }

  // ─── Normalise to a single lowercase string ───────────────────────────────
  // The API may return the status in several different shapes.
  // We extract whatever field carries it, then decide true/false once.

  // Priority 1 – explicit "status" field  e.g. { status: "active" }
  const rawStatus =
  data.message ??          // ← move this FIRST — carries "Active"/"Inactive"
  data.status ??           // ← "success" is not a status value, skip for routing
  data.onboardingStatus ??
  data.sellerStatus ??
  data.onboardStatus ??
  null;

  if (typeof rawStatus === "string") {
    const s = rawStatus.toLowerCase().trim();

    const ACTIVE_VALUES   = new Set(["active", "completed", "complete", "done"]);
    const INACTIVE_VALUES = new Set(["inactive", "incomplete", "pending", "not_completed"]);

    if (ACTIVE_VALUES.has(s))   return true;
    if (INACTIVE_VALUES.has(s)) return false;

    // Unknown string — log it so you can catch new values quickly
    console.warn("checkOnboardStatus: unrecognised status string:", s, "| full response:", data);
    return false;   // treat unknown as incomplete (safer default)
  }

  // Priority 2 – boolean shorthand fields
  if (typeof data.active    === "boolean") return data.active;
  if (typeof data.completed === "boolean") return data.completed;
  if (typeof data.onboarded === "boolean") return data.onboarded;

  // Truly unknown shape
  console.warn("checkOnboardStatus: unknown response shape:", data);
  return false;   // treat unknown as incomplete (safer default)
}