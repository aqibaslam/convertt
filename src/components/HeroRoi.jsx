// src/components/HeroRoi.jsx

import { useState, useEffect } from "react";
import Marquee from "./Marquee";
import styles from "./HeroRoi.module.css";

// ✅ Fetch by PAGE ID (49) — most reliable, bypasses slug/field issues
const WP_API_URL = "https://api.grownaturaly.com/wp-json/wp/v2/pages/49";

async function fetchHeroData() {
  const res = await fetch(WP_API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const page = await res.json();
  return page.acf || {};
}

// ── Loading Skeleton ──
function Skeleton() {
  return (
    <div className={styles.mainBg}>
      <section className={styles.heroSection}>
        <div className={styles.pageWidth}>
          <div className={styles.mainWrapper}>
            <div className={styles.skeletonBadge} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonTitleShort} />
            <div className={styles.skeletonBenefits}>
              <div className={styles.skeletonChip} />
              <div className={styles.skeletonChip} />
              <div className={styles.skeletonChip} />
            </div>
            <div className={styles.skeletonBtn} />
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Error State ──
function ErrorState({ message }) {
  return (
    <div className={styles.errorState}>
      <span>⚠️</span>
      <p>Could not load hero section</p>
      <code>{message}</code>
    </div>
  );
}

// ── Main Component ──
export default function HeroRoi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeroData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  // ✅ Exact field names from your WordPress API response
  const {
    hero_subhead_projects_number = "",
    hero_subhead_main_title      = "",
    hero_title                   = "",
    hero_section_bullets         = [],  // ✅ correct repeater field name
    cta_text                     = "",
    cta_url                      = "#",
  } = data;

  // ✅ Use formatted HTML value for title if available
  const titleHtml =
    data?.hero_title_source?.formatted_value || hero_title;

  const marqueeImages = (data?.hero_marquee_block || [])
    .map((row) => row.marquee_image)
    .filter(Boolean);

  return (
    <div className={styles.mainBg}>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.pageWidth}>
          <div className={styles.mainWrapper}>

            {/* Badge */}
            {(hero_subhead_projects_number || hero_subhead_main_title) && (
              <div className={styles.topBadge}>
                {hero_subhead_projects_number && (
                  <span className={styles.gradientText}>
                    {hero_subhead_projects_number}
                  </span>
                )}
                {hero_subhead_main_title && (
                  <span className={styles.badgeText}>
                    {hero_subhead_main_title}
                  </span>
                )}
              </div>
            )}

            {/* Title — uses formatted HTML from WP */}
            {titleHtml && (
              <h1
                className={styles.heroTitle}
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />
            )}

            {/* Benefits — ✅ field: hero_section_bullets, sub-field: heading */}
            {hero_section_bullets && hero_section_bullets.length > 0 && (
              <div className={styles.benefitsList}>
                {hero_section_bullets.map((item, i) => (
                  <div className={styles.benefitItem} key={i}>
                    <img
                      className={styles.benefitIcon}
                      src="https://convertt.co/wp-content/uploads/2026/02/teenyicons_tick-circle-outline.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden="true"
                    />
                    {/* ✅ sub-field is "heading" not "list_heading" */}
                    <span className={styles.benefitText}>{item.heading}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {cta_text && (
              <a className={styles.ctaButton} href={cta_url || "#"}>
                <span>{cta_text}</span>
                <img
                  className={styles.ctaArrow}
                  src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-1.svg"
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
              </a>
            )}

          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      {marqueeImages.length > 0 && <Marquee images={marqueeImages} />}

    </div>
  );
}
