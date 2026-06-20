// OtpPage.js - updated code check
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpScreen from "../../components/auth/OtpScreen/OtpScreen";
import { generateOtp, verifyOtp, resendOtp, checkOnboardStatus } from "../../services/sellerService";
import { saveUser } from "../../utils/userStore";
import { useAuth } from "../../context/AuthContext";
const OTP_LENGTH    = 6;
const TIMER_SECONDS = 60;

function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const routeState    = location.state || {};
  const phone         = routeState.phone || routeState.contact || "";
  const emailForStatus = routeState.email;

  const [otp,          setOtp]          = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft,     setTimeLeft]     = useState(TIMER_SECONDS);
  const [timerActive,  setTimerActive]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [resendLoading,setResendLoading]= useState(false);
  const [error,        setError]        = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);

  const timerRef  = useRef(null);
  const otpSentRef = useRef(false);

  // ─── Timer ────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // ─── Generate OTP on Mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!phone) {
      setError("Phone number not found. Please go back and try again.");
      return;
    }
    if (otpSentRef.current) return;
    otpSentRef.current = true;

    const sendOtp = async () => {
      try {
        setLoading(true);
        console.log("Generating OTP...");
        await generateOtp(phone);
        setOtpGenerated(true);
        setSuccessMsg("OTP sent to " + phone);
        setTimeout(() => setSuccessMsg(""), 3000);
        startTimer();
      } catch (err) {
        setError(err.message || "Could not send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    sendOtp();
  }, [phone, startTimer]);

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = () => {
    const code = otp.join("");

    if (!otpGenerated) { setError("OTP was not generated. Please resend."); return; }
    if (code.length < OTP_LENGTH) { setError("Please enter all 6 digits."); return; }

    setLoading(true);
    setError("");

    verifyOtp(phone, code)
      .then(async (verifyResponse) => {
        clearInterval(timerRef.current);
        setSuccessMsg("Verified successfully! Checking your account…");

        console.log("OTP Verification Success:", verifyResponse);
        console.log("User Data:", verifyResponse.user);

        const userData = verifyResponse.user || verifyResponse.seller || (verifyResponse.message && verifyResponse.message.seller) || verifyResponse;
        console.log("OTP Login User Data:", userData);

        // ── Extract email from verify response ─────────────────────────
        const emailFromResponse =
  verifyResponse?.message?.seller?.email ||
  verifyResponse?.seller?.email          ||
  verifyResponse?.email                  ||
  verifyResponse?.data?.email            ||
  null;

const sellerObj =
  verifyResponse?.message?.seller ||
  verifyResponse?.seller          ||
  verifyResponse?.message          ||
  verifyResponse                   ||
  {};

const sellerIdFromOtp =
  sellerObj.sellerId ||
  sellerObj.seller_id ||
  sellerObj._id ||
  sellerObj.id ||
  sellerObj.uid ||
  sellerObj.SellerID ||
  sellerObj.Seller_ID ||
  verifyResponse?.message?.sellerId ||
  verifyResponse?.message?.seller_id ||
  verifyResponse?.sellerId ||
  verifyResponse?.seller_id ||
  verifyResponse?.SellerID ||
  routeState.sellerId ||
  "";

const sellerPinCodeFromOtp =
  verifyResponse?.message?.seller?.pincode       ||   // ← actual response key (lowercase)
  verifyResponse?.message?.seller?.sellerPinCode ||
  verifyResponse?.message?.seller?.pinCode       ||
  verifyResponse?.seller?.pincode                ||
  verifyResponse?.seller?.sellerPinCode          ||
  verifyResponse?.seller?.pinCode                ||
  verifyResponse?.sellerPinCode                  ||
  verifyResponse?.pinCode                        ||
  "";

console.log("[OtpPage] Full verify response:", JSON.stringify(verifyResponse, null, 2));
console.log("[OtpPage] Seller ID from OTP verify:", sellerIdFromOtp || "Not found in response");
if (sellerIdFromOtp) {
  sessionStorage.setItem("__haatza_sellerId", String(sellerIdFromOtp));
  localStorage.setItem("__haatza_sellerId", String(sellerIdFromOtp));
  sessionStorage.setItem("sellerId", String(sellerIdFromOtp));
  localStorage.setItem("sellerId", String(sellerIdFromOtp));
  console.log("[OtpPage] ✅ sellerId stored:", sellerIdFromOtp);
}

if (sellerPinCodeFromOtp && /^\d{6}$/.test(String(sellerPinCodeFromOtp).trim())) {
  const pin = String(sellerPinCodeFromOtp).trim();
  sessionStorage.setItem("__haatza_sellerPinCode", pin);
  localStorage.setItem("__haatza_sellerPinCode", pin);
  sessionStorage.setItem("sellerPinCode", pin);
  localStorage.setItem("sellerPinCode", pin);
  console.log("[OtpPage] ✅ sellerPinCode stored:", pin);
} else if (sellerPinCodeFromOtp) {
  console.warn("[OtpPage] ⚠️ sellerPinCode from OTP response is not a valid 6-digit pin:", sellerPinCodeFromOtp);
}



        const emailToUse = (emailFromResponse || emailForStatus || "")
          .trim()
          .toLowerCase();

        console.log("[OtpPage] Resolved email:", emailToUse,
          "| from response:", emailFromResponse,
          "| from routeState:", emailForStatus);

        if (!emailToUse) {
          console.error("[OtpPage] ❌ No email found — cannot proceed.");
          setError("Unable to retrieve your account email. Please sign in again.");
          setLoading(false);
          return;
        }

        // ── SAVE TO BOTH STORAGES IMMEDIATELY ──────────────────────────
        // This is the critical step that was missing for phone-based login
        sessionStorage.setItem("pendingEmail", emailToUse);
        localStorage.setItem("userEmail",      emailToUse);
        console.log("[OtpPage] ✅ Email saved to storage:", emailToUse);

        // ── Extract and save seller name from verify OTP response ─────────────
        let p = verifyResponse?.message || verifyResponse?.data || verifyResponse || {};
        if (Array.isArray(p)) {
          p = p[0] || {};
        }
        const actualData = (typeof p === "string") ? (verifyResponse?.data || verifyResponse || {}) : p;
        let extractedSeller = actualData.seller || actualData.data || actualData;
        if (Array.isArray(extractedSeller)) {
          extractedSeller = extractedSeller[0] || {};
        }

        const nameFromResponse =
          extractedSeller.fullName ||
          (extractedSeller.firstName ? (extractedSeller.firstName + (extractedSeller.lastName ? " " + extractedSeller.lastName : "")).trim() : "") ||
          extractedSeller.name ||
          extractedSeller.nickname ||
          extractedSeller.sellerName ||
          actualData.fullName ||
          (actualData.firstName ? (actualData.firstName + (actualData.lastName ? " " + actualData.lastName : "")).trim() : "") ||
          actualData.name ||
          actualData.nickname ||
          actualData.sellerName ||
          routeState.fullName ||
          "";

        const companyNameFromResponse =
          extractedSeller.companyName ||
          extractedSeller.company_name ||
          extractedSeller.storeName ||
          extractedSeller.store_name ||
          extractedSeller.tradeName ||
          extractedSeller.trade_name ||
          extractedSeller.businessName ||
          extractedSeller.business_name ||
          actualData.companyName ||
          actualData.company_name ||
          actualData.storeName ||
          actualData.store_name ||
          actualData.tradeName ||
          actualData.trade_name ||
          actualData.businessName ||
          actualData.business_name ||
          "";

        const phoneFromResponse =
          extractedSeller.phone ||
          extractedSeller.phonenumber ||
          extractedSeller.phone_number ||
          extractedSeller.mobile_number ||
          extractedSeller.contact ||
          extractedSeller.mobile ||
          actualData.phone ||
          actualData.phonenumber ||
          actualData.phone_number ||
          actualData.mobile_number ||
          actualData.contact ||
          actualData.mobile ||
          "";

        const logoUrlFromResponse =
          extractedSeller.logoUrl ||
          extractedSeller.logo ||
          extractedSeller.profileImage ||
          extractedSeller.profileImg ||
          actualData.logoUrl ||
          actualData.logo ||
          actualData.profileImage ||
          actualData.profileImg ||
          "";

        const storedName =
          localStorage.getItem("sellerFullName") ||
          sessionStorage.getItem("sellerFullName") ||
          localStorage.getItem("__haatza_sellerName") ||
          sessionStorage.getItem("__haatza_sellerName") ||
          localStorage.getItem("sellerName") ||
          sessionStorage.getItem("sellerName") ||
          "";

        const finalName = nameFromResponse || routeState.fullName || (storedName && storedName !== "Seller" ? storedName : "");
        const finalCompanyName = companyNameFromResponse || (finalName !== "Seller" ? finalName : "") || "";
        const finalPhone = phone || phoneFromResponse || "";

        if (finalName && finalName !== "Seller") {
          localStorage.setItem("sellerName", finalName);
          sessionStorage.setItem("sellerName", finalName);
        }

        if (finalCompanyName && finalCompanyName !== "Seller") {
          localStorage.setItem("companyName", finalCompanyName);
          sessionStorage.setItem("companyName", finalCompanyName);
        }

        if (finalPhone) {
          localStorage.setItem("sellerPhone", finalPhone);
          sessionStorage.setItem("sellerPhone", finalPhone);
        }

        const mappedUserData = {
          email: emailToUse,
          phone: finalPhone,
          sellerId: sellerIdFromOtp,
          companyName: finalCompanyName,
          GSTIN: verifyResponse.GSTIN || verifyResponse.gstin || (verifyResponse.message?.seller?.gstin) || "",
          address: verifyResponse.address || (verifyResponse.message?.seller?.address) || "",
          pincode: sellerPinCodeFromOtp,
          nickname: verifyResponse.nickname || "",
          storageType: verifyResponse.storageType || "Seller",
          logoUrl: logoUrlFromResponse || "",
        };

        localStorage.setItem("sellerData", JSON.stringify(mappedUserData));
        console.log("OTP Login User Data:", mappedUserData);

        login({
          name: finalName,
          companyName: finalCompanyName,
          email: emailToUse,
          phone: finalPhone,
          logoUrl: logoUrlFromResponse || "",
          sellerId: sellerIdFromOtp,
          gstin: mappedUserData.GSTIN,
          address: mappedUserData.address,
          pincode: sellerPinCodeFromOtp,
          nickname: mappedUserData.nickname,
          storageType: mappedUserData.storageType,
        });
        console.log("[OtpPage] ✅ sellerName and user context initialized:", finalName);

try {
  console.log("[OtpPage] Checking onboard status for:", emailToUse);
          const isOnboarded = await checkOnboardStatus(emailToUse);

          if (isOnboarded) {
            // ✅ Navigate to dashboard and pass email in state
            navigate("/dashboard", {
              state: {
                email: emailToUse,   // ← always pass email in state
                phone,
                ...routeState,
              },
            });
          } else {
            navigate("/onboarding", {
              state: {
                email: emailToUse,   // ← always pass email in state
                phone,
                ...routeState,
              },
            });
          }
        } catch (statusErr) {
          console.error("[OtpPage] Onboard status check failed:", statusErr);
          // Email is already saved — navigate anyway
          navigate("/dashboard", {
            state: {
              email: emailToUse,
              phone,
              ...routeState,
            },
          });
        }
      })
      .catch((err) => {
        setError(err.message || "Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
      })
      .finally(() => setLoading(false));
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────
  const handleResend = () => {
    setResendLoading(true);
    setError("");
    setOtp(Array(OTP_LENGTH).fill(""));

    resendOtp(phone)
      .then(() => {
        setSuccessMsg("OTP resent to " + phone);
        setTimeout(() => setSuccessMsg(""), 3000);
        startTimer();
      })
      .catch((err) => {
        setError(err.message || "Could not resend OTP. Please try again.");
      })
      .finally(() => setResendLoading(false));
  };

  // ─── Change Number ────────────────────────────────────────────────────────
  const handleChangeNumber = () => {
    clearInterval(timerRef.current);
    navigate("/signin", { state: { prefillContact: phone } });
  };

  const handleOtpChange = (newOtpArray) => {
    setOtp(newOtpArray);
    if (error) setError("");
  };

  return (
    <OtpScreen
      phone={phone}
      otp={otp}
      onOtpChange={handleOtpChange}
      timeLeft={timeLeft}
      timerActive={timerActive}
      loading={loading}
      resendLoading={resendLoading}
      error={error}
      successMsg={successMsg}
      onVerify={handleVerify}
      onResend={handleResend}
      onChangeNumber={handleChangeNumber}
    />
  );
}

export default OtpPage;