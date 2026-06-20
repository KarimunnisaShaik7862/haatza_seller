import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sellerService } from "../../services/sellerService";
import "./SettingsPage.css";

/* ── Chevron icon ─────────────────────────────────────────── */
const ChevronRight = () => (
  <svg
    className="settings-chevron"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const LEGAL_ROWS = [
  { label: "Terms & Conditions",   icon: "📋", route: "/dashboard/settings/terms" },
  { label: "Privacy Policy",       icon: "👓", route: "/dashboard/settings/privacy" },
  { label: "Pricing & Commission", icon: "🤝", route: "/dashboard/settings/pricing" },
  { label: "Shipping & Return",    icon: "📦", route: "/dashboard/settings/shipping" },
];

function SettingsPage({ onLogout }) {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const profileName = user?.nickname || user?.name || user?.companyName || "";
  const companyName = user?.companyName || user?.name || "";
  const sellerEmail = user?.email || "";
  const sellerPhone = user?.phone || "";
  const logoUrl = user?.logoUrl || null;

  const initials = profileName ? profileName.charAt(0).toUpperCase() : "";

  const hasGstin = (user?.GSTIN || user?.gstin) && String(user?.GSTIN || user?.gstin).trim() !== "" && String(user?.GSTIN || user?.gstin).trim().toLowerCase() !== "optional";
  const hasPan = user?.panNumber && String(user.panNumber).trim() !== "" && String(user.panNumber).trim().toLowerCase() !== "optional";

  // ─── Profile Popover State ────────────────────────────────
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [editProfilePhone, setEditProfilePhone] = useState("");
  const [profileError, setProfileError] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");

  // ─── Bank Details State ──────────────────────────────────
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [editBankName, setEditBankName] = useState("");
  const [editBankHolder, setEditBankHolder] = useState("");
  const [editBankAccount, setEditBankAccount] = useState("");
  const [editBankIfsc, setEditBankIfsc] = useState("");
  const [bankError, setBankError] = useState("");
  const [bankSaving, setBankSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToastMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // ─── Handlers ────────────────────────────────────────────
  const handleProfileCardClick = () => {
    if (!showProfilePopup) {
      setEditProfileName(user?.nickname || user?.name || "");
      setEditProfileEmail(user?.email ? String(user.email) : "");
      setEditProfilePhone(user?.phone ? String(user.phone) : "");
      setIsEditingProfile(false);
      setProfileError("");
      setShowPasswordConfirm(false);
    }
    setShowProfilePopup(prev => !prev);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const nameStr = String(editProfileName || "").trim();
    const emailStr = String(editProfileEmail || "").trim();
    const phoneStr = String(editProfilePhone || "").trim();

    if (!nameStr) {
      setProfileError("Name is required");
      return;
    }
    if (!emailStr) {
      setProfileError("Email is required");
      return;
    }
    updateUser({
      name: nameStr,
      email: emailStr,
      phone: phoneStr,
    });
    setIsEditingProfile(false);
    setShowProfilePopup(false);
  };

  const handleResetPassword = async () => {
    setPasswordResetLoading(true);
    setPasswordResetError("");
    console.log("Sending Password Reset Request:", {
      email: sellerEmail
    });
    try {
      const response = await sellerService.forgotPassword(sellerEmail);
      console.log("Forgot Password Response:", response);
      console.log("Password Reset Success:", response);
      showToastMsg("Password reset email sent successfully.", "success");
      setShowPasswordConfirm(false);
    } catch (error) {
      console.error("Forgot Password Error:", error);
      console.error("Password Reset Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to send password reset request.";
      setPasswordResetError(errorMsg);
      showToastMsg(errorMsg, "error");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleStartEditBank = () => {
    setEditBankName(user?.bankName ? String(user.bankName) : "");
    setEditBankHolder(user?.accountHolder ? String(user.accountHolder) : "");
    setEditBankAccount(user?.accountNumber !== undefined && user?.accountNumber !== null ? String(user.accountNumber) : "");
    setEditBankIfsc(user?.ifscCode ? String(user.ifscCode) : "");
    setBankError("");
    setIsEditingBank(true);
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    
    // Validation
    const accountNumberRegex = /^[0-9]{9,18}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    const bankNameStr = String(editBankName || "").trim();
    const bankHolderStr = String(editBankHolder || "").trim();
    const bankAccountStr = String(editBankAccount || "").trim();
    const bankIfscStr = String(editBankIfsc || "").trim().toUpperCase();

    if (!bankNameStr) {
      setBankError("Bank name is required.");
      return;
    }
    if (!bankHolderStr) {
      setBankError("Account holder name is required.");
      return;
    }
    if (!accountNumberRegex.test(bankAccountStr)) {
      setBankError("Account number must be 9 to 18 digits.");
      return;
    }
    if (!ifscRegex.test(bankIfscStr)) {
      setBankError("Invalid IFSC code format (e.g. HDFC0001006).");
      return;
    }

    setBankSaving(true);
    setBankError("");

    try {
      const updateFields = {
        bankName: bankNameStr,
        accountHolder: bankHolderStr,
        accountNumber: Number(bankAccountStr),
        ifscCode: bankIfscStr,
      };

      console.group("[SettingsPage] Saving Bank Details");
      console.log("Payload email:", sellerEmail);
      console.log("Payload updateFields:", updateFields);
      console.groupEnd();

      const response = await sellerService.updateSellerOnboarding(sellerEmail, updateFields);

      console.group("[SettingsPage] Bank Details Update API Response");
      console.log("Raw Response:", response);
      console.groupEnd();

      if (response && (response.status === "success" || response.status === true || response.message?.status === "success")) {
        updateUser(updateFields);
        setIsEditingBank(false);
        showToastMsg("Bank details updated successfully.", "success");
      } else {
        const errorMsg = response?.message || response?.error || "Failed to update bank details.";
        setBankError(errorMsg);
        showToastMsg(errorMsg, "error");
      }
    } catch (error) {
      console.group("[SettingsPage] Bank Details Update Failed");
      console.error("Error:", error);
      console.groupEnd();
      const errorMsg = error.response?.data?.message || error.message || "Failed to update bank details.";
      setBankError(errorMsg);
      showToastMsg(errorMsg, "error");
    } finally {
      setBankSaving(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      navigate("/signin");
    }
  };

  const avatarContent = logoUrl ? (
    <img src={logoUrl} alt={profileName} className="settings-profile-avatar-img" />
  ) : (
    initials
  );

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </div>

      {/* ── Profile Header Section with Popover ── */}
      <div className="settings-profile-container">
        <div className="settings-profile-card" onClick={handleProfileCardClick}>
          <div className="settings-profile-avatar">{avatarContent}</div>
          <div className="settings-profile-info">
            <p className="settings-profile-name">{profileName}</p>
            <p className="settings-profile-email">{sellerEmail}</p>
            {sellerPhone && <p className="settings-profile-email">{sellerPhone}</p>}
          </div>
          <ChevronRight />
        </div>

        {showProfilePopup && (
          <div className="settings-profile-popup">
            <div className="popup-caret" />
            <div className="popup-header">
              <h3>Profile Settings</h3>
              <button className="popup-close-btn" onClick={() => setShowProfilePopup(false)}>✕</button>
            </div>
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="popup-form">
                {profileError && <div className="popup-error">{profileError}</div>}
                
                <div className="popup-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editProfileName}
                    disabled
                    required
                  />
                </div>

                <div className="popup-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editProfileEmail}
                    disabled
                    required
                  />
                </div>

                <div className="popup-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editProfilePhone}
                    onChange={(e) => setEditProfilePhone(e.target.value)}
                    placeholder="N/A"
                  />
                </div>

                <div className="popup-actions">
                  <button type="button" className="popup-btn cancel" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="popup-btn save">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="popup-view">
                <div className="popup-detail-row">
                  <span className="popup-label">Name</span>
                  <span className="popup-value">{user?.nickname || user?.name || ""}</span>
                </div>
                <div className="popup-detail-row">
                  <span className="popup-label">Email</span>
                  <span className="popup-value">{user?.email || ""}</span>
                </div>
                <div className="popup-detail-row">
                  <span className="popup-label">Phone</span>
                  <span className="popup-value">{user?.phone || ""}</span>
                </div>
                <div className="popup-detail-row">
                  <span className="popup-label">Address</span>
                  <span className="popup-value">{user?.address || ""}</span>
                </div>
                <div className="popup-detail-row">
                  <span className="popup-label">Pin Code</span>
                  <span className="popup-value">{user?.pincode || ""}</span>
                </div>
                <div className="popup-detail-row">
                  <span className="popup-label">GSTIN</span>
                  <span className="popup-value">{user?.GSTIN || user?.gstin || ""}</span>
                </div>
                <div className="popup-actions-footer" style={{ position: "relative" }}>
                  <button className="popup-edit-trigger" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </button>
                  <button type="button" className="popup-edit-trigger secondary" onClick={() => setShowPasswordConfirm(prev => !prev)}>
                    Change Password
                  </button>

                  {showPasswordConfirm && (
                    <div className="password-confirm-popup">
                      <div className="password-confirm-header">
                        <h4>Reset Password</h4>
                        <button type="button" className="password-confirm-close" onClick={() => { setShowPasswordConfirm(false); setPasswordResetError(""); }}>✕</button>
                      </div>
                      <p className="password-confirm-msg">Are you sure you want to reset your password?</p>
                      {passwordResetError && <div className="password-confirm-error">{passwordResetError}</div>}
                      <div className="password-confirm-actions">
                        <button type="button" className="password-confirm-btn no" onClick={() => { setShowPasswordConfirm(false); setPasswordResetError(""); }} disabled={passwordResetLoading}>
                          No
                        </button>
                        <button type="button" className="password-confirm-btn yes" onClick={handleResetPassword} disabled={passwordResetLoading}>
                          {passwordResetLoading ? "Sending..." : "Yes"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Orders Section ── */}
      <div className="settings-group">
        <button className="settings-row" onClick={() => navigate("/dashboard/orders")}>
          <span className="settings-row-icon">📦</span>
          <span className="settings-row-label">Orders</span>
          <ChevronRight />
        </button>
      </div>

      {/* ── Account Manager Card (Read-only Support Details) ── */}
      <div className="settings-section-card">
        <div className="card-header">
          <h3>Account Manager Details</h3>
        </div>
        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Account Manager</span>
            <span className="detail-value">Haatza Seller Support</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">
              <a href="mailto:support@haatzaseller.in" style={{ color: "#2962ff", textDecoration: "none" }}>support@haatzaseller.in</a>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Mobile Number</span>
            <span className="detail-value">+91 9148079015</span>
          </div>
        </div>
      </div>

      {/* ── Bank Details Card ── */}
      <div className="settings-section-card">
        <div className="card-header">
          <h3>Bank Details</h3>
          {!isEditingBank && (
            <button className="btn-card-edit" onClick={handleStartEditBank}>Edit</button>
          )}
        </div>
        
        {isEditingBank ? (
          <form onSubmit={handleSaveBank} className="card-form">
            {bankError && <div className="card-error-msg">{bankError}</div>}
            <div className="card-field">
              <label>Bank Name</label>
              <input
                type="text"
                value={editBankName}
                onChange={(e) => setEditBankName(e.target.value)}
                placeholder="Bank Name"
                disabled={bankSaving}
                required
              />
            </div>
            <div className="card-field">
              <label>Account Holder Name</label>
              <input
                type="text"
                value={editBankHolder}
                onChange={(e) => setEditBankHolder(e.target.value)}
                placeholder="Holder Name"
                disabled={bankSaving}
                required
              />
            </div>
            <div className="card-field">
              <label>Account Number</label>
              <input
                type="text"
                value={editBankAccount}
                onChange={(e) => setEditBankAccount(e.target.value)}
                placeholder="Account Number"
                disabled={bankSaving}
                required
              />
            </div>
            <div className="card-field">
              <label>IFSC Code</label>
              <input
                type="text"
                value={editBankIfsc}
                onChange={(e) => setEditBankIfsc(e.target.value)}
                placeholder="IFSC Code"
                disabled={bankSaving}
                required
              />
            </div>
            <div className="card-actions">
              <button type="button" className="btn-card-cancel" onClick={() => { setIsEditingBank(false); setBankError(""); }} disabled={bankSaving}>Cancel</button>
              <button type="submit" className="btn-card-save" disabled={bankSaving}>
                {bankSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">Bank Name</span>
              <span className="detail-value">{user?.bankName || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Holder Name</span>
              <span className="detail-value">{user?.accountHolder || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Number</span>
              <span className="detail-value">{user?.accountNumber || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">IFSC Code</span>
              <span className="detail-value">{user?.ifscCode || "N/A"}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Business Details Card (Read-only) ── */}
      <div className="settings-section-card">
        <div className="card-header">
          <h3>Business Details</h3>
        </div>
        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Storage Type</span>
            <span className="detail-value">{user?.storageType || ""}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Company Name</span>
            <span className="detail-value">{user?.companyName || ""}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{user?.address || ""}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Pin Code</span>
            <span className="detail-value">{user?.pincode || ""}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">GSTIN Number</span>
            <span className="detail-value">{user?.GSTIN || user?.gstin || ""}</span>
          </div>
          {hasPan && (
            <div className="detail-row">
              <span className="detail-label">PAN Number</span>
              <span className="detail-value">{user.panNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Legal Group ── */}
      <div className="settings-group">
        {LEGAL_ROWS.map((row) => (
          <button
            key={row.label}
            className="settings-row"
            onClick={() => navigate(row.route)}
          >
            <span className="settings-row-icon">{row.icon}</span>
            <span className="settings-row-label">{row.label}</span>
            <ChevronRight />
          </button>
        ))}
      </div>

      <div className="settings-footer">
        <button className="settings-logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      {toast.show && (
        <div className={`settings-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}

export default SettingsPage;