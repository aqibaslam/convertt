"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
// CONFIG
// Set your WP REST API base URL in .env:
//   NEXT_PUBLIC_WP_API_URL=https://your-site.com/wp-json
//
// This component fetches ACF fields from a specific page by slug.
// Change PAGE_SLUG to match your WordPress page slug.
// ─────────────────────────────────────────────
const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || "https://convertt.co/wp-json";
const PAGE_SLUG = "home"; // ← change to your page slug

async function fetchHeroData() {
  const res = await fetch(
    `${WP_API_BASE}/wp/v2/pages?slug=${PAGE_SLUG}&acf_format=standard&_fields=acf`
  );
  if (!res.ok) throw new Error(`WP API error: ${res.status}`);
  const pages = await res.json();
  if (!pages.length) throw new Error("Page not found");
  // ACF Pro 5.11+ returns fields under acf key
  return pages[0].acf;
}

// ─────────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────────
function Marquee({ images = [] }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;
    // Clone the inner content for seamless loop
    const original = track.querySelector(".marquee-content");
    if (!original) return;
    const existing = track.querySelectorAll('[aria-hidden="true"]');
    existing.forEach((el) => el.remove());
    const clone = original.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }, [images]);

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track" ref={trackRef}>
          <div className="marquee-content">
            {images.map((img, i) => (
              <div className="product-card" key={i}>
                <img src={img.url} alt={img.alt || ""} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HERO ROI SECTION
// ─────────────────────────────────────────────
export default function HeroRoiSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data) return null;

  const {
    twenty_k_heading,
    project_managed_heading,
    hero_title,
    hero_cta,
    hero_cta_url,
    hero_rating_heading,
    hero_listing = [],
    hero_marquee_block = [],
  } = data;

  return (
    <>
      <style>{styles}</style>
      <div className="main-three-section-bg">
        {/* ── HERO ── */}
        <section className="convertt-hero-roi">
          <div className="page-width">
            <div className="main-wrapper-hero-roi">

              {/* Badge */}
              <div className="top-twenty-project">
                <span className="twetnty-heading">{twenty_k_heading}</span>
                <span className="project-heading">{project_managed_heading}</span>
              </div>

              {/* Title */}
              <h1
                className="hero-title"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />

              {/* Benefits list */}
              {hero_listing.length > 0 && (
                <div className="main-benefits-hero">
                  {hero_listing.map((item, i) => (
                    <div className="block-benefits-hero" key={i}>
                      <img
                        className="benefits-block-image"
                        src="https://convertt.co/wp-content/uploads/2026/02/teenyicons_tick-circle-outline.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                      <span className="benefits-block-heading">
                        {item.list_heading}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <a className="main-hero-btn" href={hero_cta_url}>
                {hero_cta}
                <img
                  className="hero-btn-svg"
                  src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-1.svg"
                  alt=""
                  width={40}
                  height={40}
                />
              </a>

              {/* Rating */}
              {hero_rating_heading && (
                <div className="main-rating-image-info">
                  <div
                    className="rating-heading"
                    dangerouslySetInnerHTML={{ __html: hero_rating_heading }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        {hero_marquee_block.length > 0 && (
          <Marquee
            images={hero_marquee_block.map((b) => b.marquee_image)}
          />
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <>
      <style>{styles}</style>
      <div className="main-three-section-bg">
        <section className="convertt-hero-roi">
          <div className="page-width">
            <div className="main-wrapper-hero-roi" style={{ gap: 0 }}>
              <div className="skeleton" style={{ width: 240, height: 32, borderRadius: 100, margin: "0 auto" }} />
              <div className="skeleton" style={{ width: "70%", height: 80, margin: "32px auto 16px" }} />
              <div className="skeleton" style={{ width: "50%", height: 80, margin: "0 auto 32px" }} />
              <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ width: 160, height: 28 }} />
                ))}
              </div>
              <div className="skeleton" style={{ width: 200, height: 56, borderRadius: 50, margin: "40px auto" }} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#666", fontFamily: "sans-serif" }}>
      <p>⚠️ Failed to load hero section</p>
      <pre style={{ fontSize: 12, color: "#999" }}>{message}</pre>
      <p style={{ fontSize: 13 }}>
        Make sure <code>NEXT_PUBLIC_WP_API_URL</code> is set and ACF REST API is enabled.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES (identical to original PHP template)
// ─────────────────────────────────────────────
const styles = `
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.main-three-section-bg {
  background-image: url(https://convertt.co/wp-content/uploads/2026/02/Background_mask-group-scaled.webp);
  background-repeat: no-repeat;
  background-size: cover;
}
@media (max-width: 768px) {
  .main-three-section-bg {
    background-image: url(https://convertt.co/wp-content/uploads/2026/02/Frame2147241981-scaled.webp);
  }
}

.convertt-hero-roi {
  padding: 160px 0 80px;
}
.convertt-hero-roi .page-width {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 140px;
}
.convertt-hero-roi .top-twenty-project {
  border: 1px solid rgba(222, 216, 211, 1);
  padding: 5px 12px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0 auto;
}
.convertt-hero-roi .twetnty-heading {
  background: linear-gradient(90deg, #ff2e2e 0%, #ee7b16 36.28%, #8a43e1 69.75%, #d510fc 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Inter Display", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0;
  text-align: center;
  vertical-align: middle;
  text-transform: capitalize;
}
.convertt-hero-roi .project-heading {
  font-family: "Inter Display", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0;
  text-align: center;
  vertical-align: middle;
  color: rgba(0, 0, 0, 1);
}
.convertt-hero-roi .hero-title {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 800;
  font-size: 64px;
  line-height: 110%;
  letter-spacing: -1.5px;
  text-align: center;
  vertical-align: middle;
  color: rgba(30, 30, 30, 1);
  padding: 32px 0;
  margin: 0;
}
.convertt-hero-roi .block-benefits-hero {
  display: flex;
  align-items: center;
  gap: 4px;
}
.convertt-hero-roi .main-benefits-hero {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
}
.convertt-hero-roi .benefits-block-heading {
  font-family: "Inter Display", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 27px;
  letter-spacing: 0px;
  vertical-align: middle;
  color: rgba(76, 76, 76, 1);
}
.convertt-hero-roi .main-hero-btn {
  display: flex;
  gap: 16px;
  align-items: center;
  border-radius: 50px;
  height: 56px;
  width: fit-content;
  padding: 0 8px 0 24px;
  margin: 40px auto 20px;
  font-family: "Inter Display", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.1px;
  text-align: center;
  vertical-align: middle;
  color: rgba(250, 250, 250, 1);
  text-decoration: none;
  border: 3px solid transparent;
  max-width: fit-content;
  animation: spin 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  background: linear-gradient(to bottom, rgba(0,0,0,0.95), #000) padding-box,
    conic-gradient(from var(--bg-angle), #ff2e2e 0%, #ff6b2e 15%, #ee7b16 30%, #c96dd8 60%, #8a43e1 75%, #d510fc 90%, #ff2e2e 100%) border-box;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.convertt-hero-roi .hero-btn-svg {
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #ff2e2e -9.6%, #ee7b16 38.29%, #8a43e1 82.47%, #d510fc 122.4%) border-box;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 40px;
}
.convertt-hero-roi .main-hero-btn:hover {
  background: linear-gradient(135deg, #ff5d48 0%, #ff7a5c 50%, #ff9070 100%);
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.05) inset;
  border: 0;
  animation: none;
  transform: translateY(-2px);
}
.convertt-hero-roi .main-hero-btn:hover .hero-btn-svg {
  border: none;
  background: #fff;
}
@property --bg-angle {
  inherits: false;
  initial-value: 0deg;
  syntax: "<angle>";
}
@keyframes spin {
  to { --bg-angle: 360deg; }
}
.convertt-hero-roi .main-rating-image-info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.convertt-hero-roi .rating-heading {
  font-family: "Inter Display", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  text-align: center;
  color: #4C4C4C;
}
.convertt-hero-roi .rating-heading p {
  font-weight: 600;
  margin: 0;
}
.convertt-hero-roi .for-border {
  background: rgba(222, 216, 211, 1);
  width: 1px;
  height: 18px;
  margin: 0 10px;
}

/* MARQUEE */
.marquee-section {
  width: 100%;
  overflow: hidden;
}
.marquee-container {
  width: 100%;
  overflow: hidden;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-loop 25s linear infinite;
  will-change: transform;
}
.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
.marquee-content {
  display: flex;
}
.marquee-section .product-card {
  flex: 0 0 auto;
  width: 272px;
  height: 490px;
  padding: 10px;
  margin-right: 12px;
  border-radius: 20px;
  background: #fafafa;
}
.marquee-section .product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}
@keyframes marquee-loop {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* MOBILE */
@media (max-width: 768px) {
  .convertt-hero-roi {
    padding: 84px 0 24px;
  }
  .convertt-hero-roi .page-width {
    padding: 0 16px;
  }
  .convertt-hero-roi .twetnty-heading {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.1px;
  }
  .convertt-hero-roi .project-heading {
    font-size: 12px;
    line-height: 100%;
  }
  .convertt-hero-roi .top-twenty-project {
    margin: 0;
  }
  .convertt-hero-roi .hero-title {
    font-size: 38px;
    line-height: 120%;
    letter-spacing: -2px;
    text-align: left;
    padding: 8px 0 16px;
  }
  .convertt-hero-roi .main-benefits-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .convertt-hero-roi .benefits-block-heading {
    font-size: 16px;
    line-height: 22px;
  }
  .convertt-hero-roi .block-benefits-hero {
    gap: 8px;
  }
  .convertt-hero-roi .benefits-block-image {
    max-width: 16px;
    max-height: 16px;
    display: block;
  }
  .convertt-hero-roi .main-hero-btn {
    margin: 26px 0 8px;
    width: 100%;
    justify-content: space-between;
    gap: 0;
    max-width: 100%;
    border: 2px solid transparent;
  }
  .convertt-hero-roi .for-border {
    margin: 0 8px;
    height: 16px;
  }
  .marquee-track {
    animation-duration: 20s;
  }
  .marquee-section .product-card {
    width: 200px;
    height: 352px;
    padding: 8px;
    margin-right: 8px;
  }
}
`;
