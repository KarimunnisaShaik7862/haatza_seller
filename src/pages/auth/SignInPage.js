// SignInPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInForm from "../../components/auth/SignInForm/SignInForm";
import { checkSeller, checkOnboardStatus, forgotPassword, loginUser } from "../../services/sellerService";
import { saveUser } from "../../utils/userStore";
import { useAuth } from "../../context/AuthContext";

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [contact,         setContact]         = useState("");
  const [password,        setPassword]        = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [verifiedContact, setVerifiedContact] = useState(null);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  // Forgot Password popup and API states
  const [showForgotPasswordConfirm, setShowForgotPasswordConfirm] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToastMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleForgotPasswordToggle = () => {
    setForgotPasswordError("");
    setShowForgotPasswordConfirm((prev) => !prev);
  };

  const handleForgotPasswordConfirm = async () => {
    const enteredEmail = contact.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enteredEmail)) {
      setForgotPasswordError("Please enter a valid email address first.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    console.log("Sending Password Reset Request:", {
      email: enteredEmail
    });

    try {
      const response = await forgotPassword(enteredEmail);
      console.log("Forgot Password Response:", response);
      showToastMsg("Password is sent to your mail, check it.", "success");
      setShowForgotPasswordConfirm(false);
    } catch (error) {
      console.error("Forgot Password Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to send password reset request.";
      setForgotPasswordError(errorMsg);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // ─── Prefill contact from OTP "Change Number" flow ───────────────────────
  useEffect(() => {
    const prefill = location.state?.prefillContact;
    if (prefill) setContact(prefill);
  }, []);

  // ─── Handle Continue (email/phone check) ─────────────────────────────────
  const handleContinue = async () => {
    const trimmed = contact.trim();

    if (!trimmed) {
      setError("Please enter your email or mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await checkSeller(trimmed);

      if (result.userExists) {
        if (result.contactType === "email") {
          // ✅ Email & registered → show password field inline
          setVerifiedContact({
            contact:     trimmed,
            contactType: result.contactType,
            email:       result.email,
            phone:       result.phone,
            fullName:    result.fullName,
            sellerId:    result.sellerId,
          });
          setShowPassword(true);
        } else {
          // ✅ Phone & registered → navigate to OTP page
          navigate("/otp", {
            state: {
              contact:     trimmed,
              contactType: result.contactType,
              email:       result.email,
              phone:       result.phone,
              fullName:    result.fullName,
              sellerId:    result.sellerId,
            },
          });
        }
      } else {
        // ❌ Not registered → show inline error
        const errorMsg =
          result.contactType === "email"
            ? "This email is not registered. Please sign up first."
            : "This phone number is not registered. Please sign up first.";
        setError(errorMsg);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Sign In (password submit) ────────────────────────────────────
  // ─── Handle Sign In (password submit) ────────────────────────────────────
  const handleSignIn = async () => {
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    const emailForStatus = (
      verifiedContact?.email   ||
      verifiedContact?.contact ||
      contact.trim()
    ).toLowerCase().trim();

    const payload = {
      email: emailForStatus,
      password: password
    };
    console.log("Login Request:", payload);

    try {
      const response = await loginUser(emailForStatus, password);

      if (response.status !== true) {
        throw new Error(response.message || "Invalid Email or Password");
      }

      console.log("Login API Response:", response);
      console.log("Complete Seller Data:", response.userData);
      console.log("Seller ID:", response.userData.sellerId);
      console.log("Company Name:", response.userData.companyName);
      console.log("Email:", response.userData.email);
      console.log("Phone:", response.userData.phone);
      console.log("GSTIN:", response.userData.GSTIN);
      console.log("Address:", response.userData.address);
      console.log("Pincode:", response.userData.pincode);

      const loggedUser = response.userData || {};
      if (!loggedUser.nickname && verifiedContact?.fullName) {
        loggedUser.nickname = verifiedContact.fullName;
      }

      // Store complete userData object in localStorage
      localStorage.setItem("sellerData", JSON.stringify(loggedUser));

      const sellerName = loggedUser.nickname || verifiedContact?.fullName || loggedUser.companyName || "";
      const companyName = loggedUser.companyName || "";
      const phone = loggedUser.phone || "";
      const sellerId = loggedUser.sellerId || "";
      const pincode = loggedUser.pincode || "";

      // ── Save to BOTH storages before navigating ──────────────────────────
      sessionStorage.setItem("pendingEmail", emailForStatus);
      localStorage.setItem("userEmail",      emailForStatus);
      
      if (sellerName) {
        localStorage.setItem("sellerName", sellerName);
        sessionStorage.setItem("sellerName", sellerName);
      }
      if (companyName) {
        localStorage.setItem("companyName", companyName);
        sessionStorage.setItem("companyName", companyName);
      }
      if (phone) {
        localStorage.setItem("sellerPhone", phone);
        sessionStorage.setItem("sellerPhone", phone);
      }
      if (sellerId) {
        localStorage.setItem("sellerId", String(sellerId));
        sessionStorage.setItem("sellerId", String(sellerId));
        localStorage.setItem("__haatza_sellerId", String(sellerId));
        sessionStorage.setItem("__haatza_sellerId", String(sellerId));
      }
      if (pincode) {
        localStorage.setItem("sellerPinCode", String(pincode));
        sessionStorage.setItem("sellerPinCode", String(pincode));
      }

      login({
        name: sellerName,
        companyName: companyName,
        email: emailForStatus,
        phone: phone,
        logoUrl: loggedUser.logoUrl || "",
        sellerId: sellerId,
        gstin: loggedUser.GSTIN || "",
        address: loggedUser.address || "",
        pincode: pincode,
        nickname: loggedUser.nickname || "",
        storageType: loggedUser.storageType || "",
      });

      const isOnboarded = await checkOnboardStatus(emailForStatus);

      if (isOnboarded) {
        navigate("/dashboard", {
          state: { email: emailForStatus },
        });
      } else {
        navigate("/onboarding", {
          state: {
            ...verifiedContact,
            email: emailForStatus,
          },
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Invalid Email or Password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset password step if contact field changes ─────────────────────────
  const handleContactChange = (value) => {
    setContact(value);
    if (showPassword) {
      setShowPassword(false);
      setPassword("");
      setVerifiedContact(null);
    }
    if (error) setError("");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (error) setError("");
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <SignInForm
        contact={contact}
        onContactChange={handleContactChange}
        password={password}
        onPasswordChange={handlePasswordChange}
        showPassword={showPassword}
        loading={loading}
        error={error}
        onContinue={handleContinue}
        onSignIn={handleSignIn}
        onRegister={() => navigate("/signup")}
        onForgotPasswordToggle={handleForgotPasswordToggle}
        showForgotPasswordConfirm={showForgotPasswordConfirm}
        onForgotPasswordConfirm={handleForgotPasswordConfirm}
        forgotPasswordLoading={forgotPasswordLoading}
        forgotPasswordError={forgotPasswordError}
      />
      {toast.show && (
        <div className={`signin-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default SignInPage;