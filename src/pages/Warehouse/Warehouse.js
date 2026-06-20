import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Truck,
  Boxes,
  ArrowUpRight,
  PhoneCall,
  Plus,
  Building2,
  Package,
  BarChart2,
} from "lucide-react";
import "./Warehouse.css";

/* ─── Content (unchanged) ────────────────────────────────────── */
const STEPS = [
  { icon: Plus, title: "Tap Get Started", desc: "Kick off your application in under two minutes." },
  { icon: Building2, title: "Complete GST & APOB", desc: "We'll guide you through registration end to end." },
  { icon: Package, title: "Send Your Inventory", desc: "Ship stock to the warehouse nearest your buyers." },
  { icon: BarChart2, title: "Watch It Grow", desc: "Track sales, dispatch speed, and returns in real time." },
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Boost Sales by 10%+",
    desc: "Attract more customers with exclusive discounts—without impacting your margin.",
  },
  {
    icon: CheckCircle2,
    title: "100% Return Fraud Protection",
    desc: "Enjoy peace of mind with auto-approved valid RTO & fraud claims.",
  },
  {
    icon: RefreshCw,
    title: "Reduce Returns & Cancellations",
    desc: "Lower RTOs by 6-8% through expert warehouse handling.",
  },
  {
    icon: Boxes,
    title: "Real-Time Inventory Control",
    desc: "Track stock and get smart performance insights instantly.",
  },
];

const PER_UNIT_FEES = [
  {
    label: "Delivered Orders (Local Zones < 500km from Warehouse)",
    cols: ["₹4", "₹10", "₹13.50", "₹28", "₹38"],
  },
  {
    label: "Delivered Orders (National Zones > 500km from Warehouse)",
    cols: ["₹15", "₹20", "₹27", "₹40", "₹67"],
  },
  {
    label: "Return Orders",
    cols: ["₹12.75", "₹14", "₹14.75", "₹20.50", "₹20.50"],
  },
  {
    label: "SKUs unsold > 30 days",
    cols: ["₹7.50", "₹17", "₹28", "₹50", "₹104"],
  },
  {
    label: "B2B reject fee",
    cols: ["₹4", "₹11", "₹17", "₹30", "₹66"],
  },
  {
    label: "RTO / Storage / Insurance Charges",
    cols: ["FREE", "FREE", "FREE", "FREE", "FREE"],
  },
];

const WEIGHT_TIERS = ["Upto 150gms", "151–500gms", "501–1000gms", "1001–2000gms", "Above 2000gms"];

const REVERSE_SHIPPING = [
  {
    courier: "valmo",
    cols: ["₹153", "₹145", "₹163", "₹155", "₹169", "₹161", "₹184", "₹176", "₹202", "₹194"],
  },
  {
    courier: "xpressbees",
    cols: ["₹155", "₹147", "₹165", "₹157", "₹171", "₹163", "₹186", "₹178", "₹204", "₹196"],
  },
  {
    courier: "shadowfax",
    cols: ["₹162", "₹154", "₹172", "₹164", "₹178", "₹170", "₹192", "₹184", "₹210", "₹202"],
  },
  {
    courier: "delhivery",
    cols: ["₹161", "₹153", "₹203", "₹195", "₹244", "₹236", "₹290", "₹282", "₹340", "₹332"],
  },
  {
    courier: "ecom",
    cols: ["₹165", "₹157", "₹175", "₹167", "₹181", "₹173", "₹198", "₹188", "₹213", "₹205"],
  },
];

const REVERSE_TIERS = [
  "Upto 500gms\n(Self Ship)", "Upto 500gms\n(Warehouse)",
  "501–1000gms\n(Self Ship)", "501–1000gms\n(Warehouse)",
  "1001–1500gms\n(Self Ship)", "1001–1500gms\n(Warehouse)",
  "1501–2000gms\n(Self Ship)", "1501–2000gms\n(Warehouse)",
  "2001–2500gms\n(Self Ship)", "2001–2500gms\n(Warehouse)",
];

const ONE_TIME_FEES = [
  { service: "GST + APOB", charge: "₹9,999", note: "+ GST · most sellers start here", highlight: true },
  { service: "VPOB Renewal", charge: "₹8,000", note: "+ GST · annual renewal" },
  { service: "Only APOB", charge: "₹500", note: "+ GST · address proof only" },
];



/* ─── Page ───────────────────────────────────────────────────── */
function WarehouseOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="hwo-page">
      {/* ── Hero (dispatch-dock dark band) ── */}
      <section className="hwo-hero">
        <div className="hwo-container hwo-hero__topline">
          <span className="hwo-tracking">HAATZA · FULFILLMENT NETWORK</span>
          <div className="hwo-barcode" aria-hidden="true" />
        </div>

        <div className="hwo-container hwo-hero__grid">
          <div className="hwo-hero__content">
            <h1 className="hwo-hero__title">
              Scale your business with <span>Haatza Warehousing</span>
            </h1>
            <p className="hwo-hero__subtitle">
              Hand off storage, packing, and dispatch to our fulfillment network and
              focus on growing your catalog — we handle the rest.
            </p>
            <div className="hwo-cta-row">
              <button className="hwo-btn hwo-btn--primary" onClick={() => navigate("/warehouse/get-started")}>
                Get Started <ArrowUpRight size={16} />
              </button>
              <button className="hwo-btn hwo-btn--outline" onClick={() => navigate("/warehouse/callback")}>
                <PhoneCall size={15} /> Request Callback
              </button>
            </div>
          </div>

          <div className="hwo-hero__visual">
            <div className="hwo-ticket">
              <p className="hwo-ticket__label">Fulfillment Network</p>
              <div className="hwo-ticket__perf" />
              <div className="hwo-ticket__row">
                <div className="hwo-ticket__icon"><Truck size={15} /></div>
                <span className="hwo-ticket__rowlabel">Avg. Dispatch Time</span>
                <span className="hwo-ticket__value">1.4 days</span>
              </div>
              <div className="hwo-ticket__row">
                <div className="hwo-ticket__icon"><CheckCircle2 size={15} /></div>
                <span className="hwo-ticket__rowlabel">Stock Accuracy</span>
                <span className="hwo-ticket__value">98.7%</span>
              </div>
              <div className="hwo-ticket__row">
                <div className="hwo-ticket__icon"><Boxes size={15} /></div>
                <span className="hwo-ticket__rowlabel">Fulfillment Hubs</span>
                <span className="hwo-ticket__value">3 cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps: delivery route ── */}
      <section className="hwo-section">
        <div className="hwo-container">
          <div className="hwo-section__head">
            <span className="hwo-eyebrow">Onboarding</span>
            <h2 className="hwo-section__title">Join in 4 simple steps</h2>
          </div>
          <div className="hwo-route">
            <div className="hwo-route__line" aria-hidden="true" />
            {STEPS.map((step, i) => (
              <div key={step.title} className="hwo-route__stop">
                <div className="hwo-route__node"><step.icon size={16} /></div>
                <div className="hwo-route__card">
                  <span className="hwo-route__tag">STEP {i + 1}/4</span>
                  <p className="hwo-route__title">{step.title}</p>
                  <p className="hwo-route__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits: stamped manifest ── */}
      {/* ── Benefits: why haatza ── */}
      <section className="hwo-section hwo-section--soft">
        <div className="hwo-container">
          <div className="hwo-section__head">
            <span className="hwo-eyebrow">Why Haatza Warehousing</span>
            <h2 className="hwo-section__title">Why Choose Haatza Warehousing?</h2>
          </div>
          <div className="hwo-stamps">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className={`hwo-stamp ${i % 2 === 0 ? "hwo-stamp--a" : "hwo-stamp--b"}`}>
                <div className="hwo-stamp__icon"><b.icon size={20} /></div>
                <p className="hwo-stamp__title">{b.title}</p>
                <p className="hwo-stamp__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Fees: scrollable pricing tables ── */}
      <section className="hwo-section">
        <div className="hwo-container">
          <div className="hwo-section__head">
            <span className="hwo-eyebrow">Pricing</span>
            <h2 className="hwo-section__title">Warehouse fees</h2>
            <p className="hwo-section__sub">Transparent per-unit pricing across all weight tiers — no hidden charges.</p>
          </div>

          {/* Per Unit Charges */}
          <p style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--ink)" }}>
            Per Unit Charges
          </p>
          <div className="hwo-scroll-table-wrap" style={{ marginBottom: 32 }}>
            <table className="hwo-scroll-table">
              <thead>
                <tr>
                  <th>Service</th>
                  {WEIGHT_TIERS.map((t) => <th key={t}>{t}</th>)}
                </tr>
              </thead>
              <tbody>
                {PER_UNIT_FEES.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    {row.cols.map((v, i) => <td key={i}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reverse Shipping Fees */}
          <p style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--ink)" }}>
            Reverse Shipping Fees
          </p>
          <div className="hwo-scroll-table-wrap">
            <table className="hwo-scroll-table">
              <thead>
                <tr>
                  <th>Courier Partner</th>
                  {REVERSE_TIERS.map((t) => (
                    <th key={t} style={{ whiteSpace: "pre-line" }}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REVERSE_SHIPPING.map((row) => (
                  <tr key={row.courier}>
                    <td style={{ textTransform: "capitalize" }}>{row.courier}</td>
                    {row.cols.map((v, i) => <td key={i}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── One-time charges: cargo tags ── */}
      <section className="hwo-section hwo-section--soft">
        <div className="hwo-container">
          <div className="hwo-section__head">
            <span className="hwo-eyebrow">Setup</span>
            <h2 className="hwo-section__title">One-time charges per warehouse location</h2>
          </div>
          <div className="hwo-tags">
            {ONE_TIME_FEES.map((tier) => (
              <div key={tier.service} className={`hwo-tag ${tier.highlight ? "hwo-tag--highlight" : ""}`}>
                <span className="hwo-tag__hole" />
                {tier.highlight && <span className="hwo-tag__stamp">Most common</span>}
                <p className="hwo-tag__service">{tier.service}</p>
                <p className="hwo-tag__charge">{tier.charge}</p>
                <p className="hwo-tag__note">{tier.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA (dispatch-dock dark band) ── */}
      <section className="hwo-cta-band">
        <div className="hwo-container hwo-cta-band__inner">
          <div>
            <h2>Ready to move your fulfillment to Haatza?</h2>
            <p>Get set up in a day, dispatch from day two.</p>
          </div>
          <div className="hwo-cta-row">
            <button className="hwo-btn hwo-btn--primary" onClick={() => navigate("/warehouse/get-started")}>
              Get Started <ArrowUpRight size={16} />
            </button>
            <button className="hwo-btn hwo-btn--outline hwo-btn--on-dark" onClick={() => navigate("/warehouse/callback")}>
              Request Callback
            </button>
          </div>
        </div>
        <div className="hwo-container hwo-footer-manifest">
          <span>MANIFEST NO. HWZ-2026-WH</span>
          <div className="hwo-barcode hwo-barcode--small" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}

export default WarehouseOnboarding;