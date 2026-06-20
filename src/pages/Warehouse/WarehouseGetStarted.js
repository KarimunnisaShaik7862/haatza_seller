import { useState } from "react";
import {
  ArrowLeft, Warehouse, CheckCircle2, Phone, Mail, Globe,
  Zap, RotateCcw, BarChart2, Layers, Loader2, Package,
  ClipboardList, RefreshCw, HeadphonesIcon, AtSign,
  Hash, Smartphone, FileText, MapPin,
  ClipboardCheck, TrendingUp, DollarSign, Search,
} from "lucide-react";
import "./WarehouseGetStarted.css";
import { sellerService } from "../../services/sellerService";
const LOCATIONS = ["Bangalore", "Chennai"];

const SERVICES = [
  { icon: Package,        name: "Inventory Management", desc: "Track stock levels and receive alerts for low stock." },
  { icon: ClipboardList,  name: "Order Fulfillment",     desc: "Picking, packing, and shipping support for timely delivery." },
  { icon: RefreshCw,      name: "Returns Processing",    desc: "Efficient handling of returns and exchanges." },
  { icon: BarChart2,      name: "Reporting & Analytics", desc: "Access detailed reports on inventory and order history." },
  { icon: HeadphonesIcon, name: "Customer Support",      desc: "Dedicated warehouse assistance team available for you." },
];

const NEXT_STEPS = [
  { icon: Search,        title: "Request Review",        desc: "Our team reviews your request and gets back to you shortly." },
  { icon: ClipboardCheck,title: "Business Consultation", desc: "We discuss your requirements and craft a customized solution." },
  { icon: DollarSign,    title: "Flexible Pricing",      desc: "Plans suitable for both small sellers and large enterprises." },
  { icon: TrendingUp,    title: "Business Growth",       desc: "Reduce costs and focus on scaling your business." },
];

export default function WarehouseGetStarted({
  sellerId,
  email,
  phone,
}) {
  const resolvedSellerId = sellerId || sellerService.getCachedSellerId();
  const resolvedEmail    = email    || sellerService.getCachedSellerEmail();
  const resolvedPhone    = phone    || sellerService.getCachedSellerPhone();

  const [form, setForm] = useState({
    sellerId: resolvedSellerId || "",
    email: resolvedEmail || "",
    relatedEmail: "",
    phone: resolvedPhone || "",
    gstin: "",
    locations: [],
    gstState: "",
    dsc: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggle = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await sellerService.submitWarehouseRequest({
        sellerId: form.sellerId,
        email: form.email,
        phone: form.phone,
        requestType: "Storage",
      });
      setSuccess(true);
    } catch (err) {
      console.error("[WarehouseGetStarted] Submit failed:", err);
      alert(err?.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* ── Header ── */}
      {/* ── Back Button ── */}
<div className="page-topbar">
  <button className="back-btn" onClick={() => window.history.back()}>
    <ArrowLeft size={16} />
    Back to Warehouse
  </button>
</div>

      <div className="body">
        {/* ── Hero ── */}
        <div className="hero">
          <div className="hero-badge">
            <span className="hero-dot" />
            Active Enrollments Open
          </div>
          <div className="hero-title">Warehouse Services</div>
          <div className="hero-sub">
            Professional inventory storage, fulfillment, returns management, and dedicated warehouse support for Haatza sellers.
          </div>
          <div className="hero-pills">
            {[
              { icon: Zap,       label: "Faster Dispatch" },
              { icon: RotateCcw, label: "Reduced RTO" },
              { icon: Layers,    label: "Inventory Control" },
              { icon: BarChart2, label: "Scalable Ops" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="hero-pill">
                <Icon size={12} /> {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Services ── */}
        <div className="card">
          <div className="card-title">Services Offered</div>
          <div className="card-sub">Everything you need to fulfill orders and grow your business</div>
          <div className="services-grid">
            {SERVICES.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="svc-card">
                <div className="svc-icon"><Icon size={20} /></div>
                <div className="svc-name">{name}</div>
                <div className="svc-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Seller Details ── */}
        <div className="card">
          <div className="card-title">Seller Details</div>
          <div className="card-sub">Your account information for enrollment</div>
          <div className="form-grid">
            <div className="field">
              <div className="field-label">Seller ID <span className="field-req">*</span></div>
              <div className="input-wrap">
                <span className="input-icon"><Hash size={15} /></span>
                <input
                  className="input"
                  placeholder="SELL-000123"
                  value={form.sellerId}
                  onChange={(e) => setForm((f) => ({ ...f, sellerId: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <div className="field-label">Email <span className="field-req">*</span></div>
              <div className="input-wrap">
                <span className="input-icon"><AtSign size={15} /></span>
                <input
                  className="input"
                  placeholder="seller@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <div className="field-label">Related Email</div>
              <div className="input-wrap">
                <span className="input-icon"><Mail size={15} /></span>
                <input
                  className="input"
                  placeholder="alternate@email.com"
                  value={form.relatedEmail}
                  onChange={(e) => setForm((f) => ({ ...f, relatedEmail: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <div className="field-label">Phone Number <span className="field-req">*</span></div>
              <div className="input-wrap">
                <span className="input-icon"><Smartphone size={15} /></span>
                <input
                  className="input"
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <div className="field-label">GSTIN</div>
              <div className="input-wrap">
                <span className="input-icon"><FileText size={15} /></span>
                <input
                  className="input"
                  placeholder="22AAAAA0000A1Z5"
                  value={form.gstin}
                  onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Warehouse Locations ── */}
        <div className="card">
          <div className="card-title">Warehouse Locations</div>
          <div className="card-sub">Choose the locations you'd like to enroll with Haatza</div>
          <div className="loc-grid">
            {LOCATIONS.map((loc) => {
              const sel = form.locations.includes(loc);
              return (
                <button
                  key={loc}
                  className={`loc-card ${sel ? "loc-card-sel" : ""}`}
                  onClick={() => toggle("locations", loc)}
                >
                  <MapPin size={18} className="loc-pin" />
                  {loc}
                  {sel
                    ? <span className="loc-check"><CheckCircle2 size={14} /></span>
                    : <span className="loc-circle" />
                  }
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GST + DSC Verification ── */}
        <div className="verify-row">
          <div className="card">
            <div className="card-title">GST Verification</div>
            <div className="card-sub">Is your GST registered in the KAM-recommended state?</div>
            <div className="radio-row">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className={`radio-card ${form.gstState === opt ? "radio-sel" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, gstState: f.gstState === opt ? "" : opt }));
                  }}
                >
                  <input type="radio" name="gstState" value={opt} checked={form.gstState === opt} readOnly />
                  {form.gstState === opt && <CheckCircle2 size={16} />}
                  {opt === "Yes" ? "✓  Yes" : "✗  No"}
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">DSC Verification</div>
            <div className="card-sub">Is a Digital Signature Certificate (DSC) available with you?</div>
            <div className="radio-row">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className={`radio-card ${form.dsc === opt ? "radio-sel" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, dsc: f.dsc === opt ? "" : opt }));
                  }}
                >
                  <input type="radio" name="dsc" value={opt} checked={form.dsc === opt} readOnly />
                  {form.dsc === opt && <CheckCircle2 size={16} />}
                  {opt === "Yes" ? "✓  Yes" : "✗  No"}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── What Happens Next ── */}
        <div className="card">
          <div className="card-title">What Happens Next?</div>
          <div className="card-sub">Here's how your onboarding journey unfolds</div>
          <div className="steps-grid">
            {NEXT_STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="step-card">
                <div className="step-icon"><Icon size={18} /></div>
                <div className="step-title">{title}</div>
                <div className="step-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="card info-card">
          <div className="info-accent" />
          <div className="info-card-inner">
            <div className="card-title">Need Help?</div>
            <div className="card-sub">Our warehouse team is ready to assist you</div>
            <div className="contact-list">
              <a href="mailto:warehouse@haatza.com" className="contact-item">
                <span className="contact-icon"><Mail size={16} /></span>
                warehouse@haatza.com
              </a>
              <a href="tel:+919148079015" className="contact-item">
                <span className="contact-icon"><Phone size={16} /></span>
                +91 914 807 9015
              </a>
              <a href="https://www.haatzaseller.com" target="_blank" rel="noreferrer" className="contact-item">
                <span className="contact-icon"><Globe size={16} /></span>
                www.haatzaseller.com
              </a>
            </div>
          </div>
        </div>

        {/* ── Submit (desktop) ── */}
        {/* ── Submit (desktop) ── */}
        <div className="submit-wrap">
          <button className="submit-btn submit-desktop" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Processing…</> : "Request Service"}
          </button>
        </div>
      </div>

      {/* ── Sticky Submit (mobile) ── */}
      <div className="sticky-bar">
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Loader2 size={18} className="spin" /> Processing…</> : "Request Service"}
        </button>
      </div>

      {/* ── Success Modal ── */}
      {success && (
        <div className="modal-overlay" onClick={() => setSuccess(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><CheckCircle2 size={38} /></div>
            <div className="modal-title">Request Submitted Successfully</div>
            <div className="modal-desc">
              Your warehouse service request has been submitted successfully. Our team will contact you shortly.
            </div>
            <div className="modal-btns">
              <button className="submit-btn" onClick={() => setSuccess(false)}>
                Back to Dashboard
              </button>
              <button className="btn-outline" onClick={() => setSuccess(false)}>
                Track Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}