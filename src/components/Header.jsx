// src/components/Header.jsx
// Converted from WordPress PHP header.php
// Supports all 4 header variants via props:
//   variant="simple"   → logo + CTA only (page IDs 9035, 9073)
//   variant="roi"      → logo + mega nav + CTA (roi_pages_template)
//   variant="dentalist"→ logo + nav + CTA (page IDs 6383, 6627, 6643)
//   variant="default"  → logo + nav + CTA dark button (all other pages)
//
// Usage in App.js:
//   import Header from './components/Header';
//   <Header variant="default" />

import { useState, useEffect, useRef } from "react";

const WP_API = "https://api.grownaturaly.com/wp-json/wp/v2/pages/49";

async function fetchHeaderData() {
  const res = await fetch(WP_API);
  if (!res.ok) return {};
  const page = await res.json();
  return page.acf || {};
}

// ── Arrow SVG (reused) ──
const ArrowSVG = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.0254 4.94189L17.0837 10.0002L12.0254 15.0586" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.91699 10H16.942" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NavArrowSVG = () => (
  <svg className="nav-arrow" width="12" height="7" viewBox="0 0 12 7" fill="none">
    <path d="M0 1.07208C0 1.34408 0.128 1.60008 0.272 1.74408L5.072 6.48008C5.264 6.67208 5.536 6.73608 5.792 6.73608C6.064 6.73608 6.336 6.67208 6.528 6.48008L11.664 1.74408C11.872 1.53608 12 1.34408 12 1.07208C12 0.800084 11.936 0.544084 11.728 0.336084C11.536 0.144083 11.264 8.34465e-05 10.992 8.34465e-05C10.736 8.34465e-05 10.464 0.0800838 10.272 0.336084L5.792 4.40008L1.6 0.336084C1.472 0.208084 1.264 0.0800838 0.992 0.0800838C0.736 0.0800838 0.464 0.144083 0.272 0.336084C0.064 0.608084 0 0.800084 0 1.07208Z" fill="#646464" fillOpacity="0.9"/>
  </svg>
);

// ─────────────────────────────────────────────
// VARIANT 1 & 2: SIMPLE (logo + CTA only)
// ─────────────────────────────────────────────
function HeaderSimple({ data }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoUrl = data?.site_logo?.url || "";
  const logoAlt = data?.site_logo?.alt || "Logo";
  const ctaText = data?.cta_text || "Book Free Consultation";
  const ctaUrl  = data?.cta_url  || "#";

  return (
    <header className={`convertt-header-roi${isSticky ? " is-sticky" : ""}`} id="stickyHeader">
      <div className="h-page-width">
        <div className="main-wrapper-header">
          <div className="main-logo-sales">
            <a href="/">
              {logoUrl
                ? <img className="header-logo" src={logoUrl} alt={logoAlt} />
                : <span className="logo-text">Convertt</span>}
            </a>
          </div>
          <div className="main-mob-tog-btn">
            <div className="main-btn-header">
              <a className="btn-header btn-light" href={ctaUrl}>
                <span className="btn-text">{ctaText}</span>
                <img className="header-btn-svg" src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-4.svg" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// VARIANT 3: ROI PAGES (logo + mega nav + CTA)
// ─────────────────────────────────────────────
function HeaderROI({ data }) {
  const [isSticky, setIsSticky]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openNav, setOpenNav]     = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenNav(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoUrl = data?.site_logo?.url || "";
  const logoAlt = data?.site_logo?.alt || "Logo";
  const ctaText = data?.cta_text || "Book Free Consultation";
  const ctaUrl  = data?.cta_url  || "#";

  // Menu from ACF 'menu' repeater — fallback to static
  const menuItems = data?.menu || [
    { page_name: "Results",    sub_menu: [] },
    { page_name: "Process",    sub_menu: [] },
    { page_name: "Work",       sub_menu: [] },
    { page_name: "Pricing",    sub_menu: [] },
    { page_name: "Industries", sub_menu: [] },
  ];

  const isMobile = () => window.innerWidth <= 991;

  return (
    <header
      ref={headerRef}
      className={[
        "convertt-header-roi",
        isSticky  ? "is-sticky"   : "",
        menuOpen  ? "menu-open"   : "",
      ].filter(Boolean).join(" ")}
      id="stickyHeader"
    >
      <div className="h-page-width">
        <div className="main-wrapper-header">

          {/* Logo */}
          <div className="main-logo-sales">
            <a href="/">
              {logoUrl
                ? <img className="header-logo" src={logoUrl} alt={logoAlt} />
                : <span className="logo-text">Convertt</span>}
            </a>
          </div>

          {/* Nav */}
          <ul className={`nav-list${menuOpen ? " show" : ""}`} id="navList">
            {menuItems.map((item, i) => {
              const hasSub = item.sub_menu && item.sub_menu.length > 0;
              const isOpen = openNav === i;
              return (
                <li
                  key={i}
                  className={`nav-item has-submenu${isOpen ? " open" : ""}`}
                  onMouseEnter={() => !isMobile() && hasSub && setOpenNav(i)}
                  onMouseLeave={() => !isMobile() && setOpenNav(null)}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      if (isMobile() && hasSub) {
                        e.preventDefault();
                        setOpenNav(isOpen ? null : i);
                      }
                    }}
                  >
                    {item.page_name}
                    {hasSub && <NavArrowSVG />}
                  </a>

                  {hasSub && isOpen && (
                    <div className="mega-wrapper">
                      <div className="content-container">
                        <div className="row-grid">
                          {item.sub_menu.map((sub, j) => {
                            const hasSecond = sub.second_sub_menu && sub.second_sub_menu.length > 0;
                            const cardKey = `${i}-${j}`;
                            const isActive = activeCard === cardKey;
                            return (
                              <div className="mobile-item-group" key={j}>
                                <div
                                  className={`category-card${isActive ? " active" : ""}`}
                                  onMouseEnter={() => !isMobile() && hasSecond && setActiveCard(cardKey)}
                                  onMouseLeave={() => !isMobile() && setActiveCard(null)}
                                  onClick={() => isMobile() && setActiveCard(isActive ? null : cardKey)}
                                >
                                  {sub.icon?.url && (
                                    <div className="icon">
                                      <img src={sub.icon.url} alt={sub.icon.alt || ""} />
                                    </div>
                                  )}
                                  <div className="category-info">
                                    <h4>{sub.page_name}</h4>
                                    {sub.description && <p>{sub.description}</p>}
                                  </div>
                                  {hasSecond && (
                                    <svg className="card-arrow" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                      <path d="M0 1.07208C0 1.34408 0.128 1.60008 0.272 1.74408L5.072 6.48008C5.264 6.67208 5.536 6.73608 5.792 6.73608C6.064 6.73608 6.336 6.67208 6.528 6.48008L11.664 1.74408C11.872 1.53608 12 1.34408 12 1.07208C12 0.800084 11.936 0.544084 11.728 0.336084C11.536 0.144083 11.264 8.34465e-05 10.992 8.34465e-05C10.736 8.34465e-05 10.464 0.0800838 10.272 0.336084L5.792 4.40008L1.6 0.336084C1.472 0.208084 1.264 0.0800838 0.992 0.0800838C0.736 0.0800838 0.464 0.144083 0.272 0.336084C0.064 0.608084 0 0.800084 0 1.07208Z" fill="#1E1E1E"/>
                                    </svg>
                                  )}
                                </div>
                                {hasSecond && isActive && (
                                  <div className="results-grid-container active">
                                    <div className="sub-grid">
                                      {sub.second_sub_menu.map((s, k) => (
                                        <div className="sub-item" key={k}>
                                          {s.icon?.url && <img src={s.icon.url} alt={s.icon.alt || ""} />}
                                          {s.page_name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* CTA + Hamburger */}
          <div className="main-mob-tog-btn">
            <div className="main-btn-header">
              <a className="btn-header btn-light" href={ctaUrl}>
                <span className="btn-text">{ctaText}</span>
                <img className="header-btn-svg" src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-4.svg" alt="" />
              </a>
            </div>
            <button
              className="mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// VARIANT 4: DEFAULT (dark CTA + hamburger)
// ─────────────────────────────────────────────
function HeaderDefault({ data }) {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoUrl = data?.latest_header_logo?.url || "";
  const logoAlt = data?.latest_header_logo?.alt || "Logo";
  const ctaText = data?.latest_header_cta || data?.cta_text || "Book Free Consultation";
  const ctaUrl  = data?.latest_header_cta_url || data?.cta_url || "#";

  // Static nav items — replace with your actual menu items
  const navItems = [
    { label: "Results",    href: "#results" },
    { label: "Process",    href: "#process" },
    { label: "Work",       href: "#work" },
    { label: "Pricing",    href: "#pricing" },
    { label: "Industries", href: "#industries" },
  ];

  return (
    <header
      ref={headerRef}
      className={[
        "convertt-co-header",
        isSticky ? "scrolled" : "",
        menuOpen ? "menu-open" : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="h-page-width">
        <div className="main-wrapper-header">

          {/* Logo */}
          <div className="main-logo-sales">
            <a href="/">
              {logoUrl
                ? <img className="header-logo" src={logoUrl} alt={logoAlt} />
                : <span className="logo-text">Convertt</span>}
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="main-menu-header">
            <ul className="menu-list">
              {navItems.map((item, i) => (
                <li key={i} className="nav-item">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA + Hamburger */}
          <div className="main-btn-header">
            <a className="btn-header btn-dark" href={ctaUrl}>
              {ctaText}
              <ArrowSVG />
            </a>
          </div>

          <button
            className="hamburger-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path d="M18 6L6 18M6 6L18 18" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="#041004" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="mobile-menu-dropdown active">
            <div className="mobile-menu-items">
              {navItems.map((item, i) => (
                <a
                  key={i}
                  className="menu-header"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a className="mobile-cta-btn" href={ctaUrl}>
                {ctaText}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT — picks variant via prop
// ─────────────────────────────────────────────
export default function Header({ variant = "default" }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchHeaderData().then(setData).catch(console.error);
  }, []);

  const renderHeader = () => {
    switch (variant) {
      case "simple":    return <HeaderSimple data={data || {}} />;
      case "roi":       return <HeaderROI    data={data || {}} />;
      case "default":
      default:          return <HeaderDefault data={data || {}} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {renderHeader()}
    </>
  );
}

// ─────────────────────────────────────────────
// ALL CSS
// ─────────────────────────────────────────────
const CSS = `
  /* ── Shared ── */
  .convertt-header-roi,
  .convertt-co-header {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 2000;
    transition: top 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .convertt-header-roi { top: 32px; height: 42px; }
  .convertt-co-header  { top: 0;    height: 80px; display:flex; align-items:center; }

  .h-page-width {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 80px;
    transition:
      background     0.4s cubic-bezier(0.4,0,0.2,1),
      border-radius  0.4s cubic-bezier(0.4,0,0.2,1),
      box-shadow     0.4s cubic-bezier(0.4,0,0.2,1),
      padding        0.4s cubic-bezier(0.4,0,0.2,1),
      max-width      0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .main-wrapper-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .main-logo-sales { width: 210px; }
  .header-logo     { max-width: 100%; display: block; }
  .logo-text       { font-weight: 800; font-size: 20px; color: #1E1E1E; }

  /* ── Nav list ── */
  .nav-list {
    list-style: none;
    display: flex;
    gap: 40px;
    height: 100%;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 730px;
    justify-content: center;
  }
  .nav-item { height: 100%; display: flex; align-items: center; position: relative; }
  .nav-item > a {
    font-family: "Inter Display", Inter, sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(100,100,100,1);
  }
  .nav-arrow {
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }
  .nav-item:hover .nav-arrow,
  .nav-item.open .nav-arrow { transform: rotate(180deg); }

  /* Desktop nav (default header) */
  .main-menu-header .menu-list {
    list-style: none;
    display: flex;
    gap: 40px;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  .main-menu-header .nav-item > a {
    font-family: "Inter Display", Inter, sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: rgba(100,100,100,1);
    text-decoration: none;
    transition: color 0.2s;
  }
  .main-menu-header .nav-item > a:hover { color: #1E1E1E; }

  /* ── CTA Buttons ── */
  .btn-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 0 6px 0 24px;
    height: 40px;
    border-radius: 60px;
    font-family: "Inter Display", Inter, sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.1px;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  .btn-header:hover { opacity: 0.85; }
  .btn-light {
    background: rgba(250,250,250,1);
    border: 1px solid rgba(0,0,0,1);
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.05) inset;
    color: rgba(30,30,30,1);
  }
  .btn-dark {
    background: rgba(30,30,30,1);
    color: #fff;
    border: none;
    padding: 0 14px 0 24px;
    gap: 10px;
  }
  .header-btn-svg { width: 28px; }
  .main-mob-tog-btn { display: flex; align-items: center; gap: 10px; }
  .convertt-header-roi .main-btn-header { width: unset; }

  /* ── Hamburger ── */
  .mobile-toggle,
  .hamburger-menu {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    box-shadow: none;
    outline: none;
    font-size: 24px;
    color: black;
  }

  /* ── Mega Menu ── */
  .mega-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 70px;
    width: 1360px;
    background: rgba(245,245,245,1);
    padding: 24px;
    margin: 0 auto;
    z-index: 1000;
    border-radius: 16px;
  }
  .row-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .category-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background: #fff;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
    height: 100%;
  }
  .category-card.active { background: #f3e8ff; border-color: #ff4d94; }
  .card-arrow {
    flex-shrink: 0;
    margin-left: auto;
    transition: transform 0.25s ease;
  }
  .category-card.active .card-arrow { transform: rotate(180deg); }
  .icon { width: 60px; height: 60px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .icon img { width: 100%; }
  .category-info h4 {
    font-size: 16px;
    color: rgba(30,30,30,1);
    font-weight: 700;
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  .category-info p {
    font-size: 14px;
    color: rgba(149,149,149,1);
    line-height: 18px;
    font-weight: 400;
    font-family: "Plus Jakarta Sans", sans-serif;
    padding-top: 12px;
  }
  .results-grid-container {
    margin-top: 16px;
    background: rgba(248,249,250,1);
    border-radius: 16px;
    padding: 32px;
  }
  .sub-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
  .sub-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1E1E1E;
    font-family: "Inter Display", sans-serif;
  }

  /* ── Mobile dropdown (default header) ── */
  .mobile-menu-dropdown.active {
    background: rgba(248,249,250,1);
    padding: 16px;
    border-radius: 0 0 12px 12px;
  }
  .mobile-menu-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .menu-header {
    font-family: "Inter Display", Inter, sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: rgba(100,100,100,1);
    text-decoration: none;
    padding: 10px 8px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .menu-header:hover { color: #1E1E1E; }
  .mobile-cta-btn {
    margin-top: 12px;
    background: rgba(30,30,30,1);
    color: #fff;
    border-radius: 60px;
    padding: 10px 24px;
    font-weight: 600;
    font-size: 15px;
    text-align: center;
    text-decoration: none;
    font-family: "Inter Display", Inter, sans-serif;
  }

  /* ── Sticky ── */
  .is-sticky,
  .convertt-co-header.scrolled {
    position: fixed !important;
    top: 16px !important;
    animation: prismo-slide-down 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }
  .is-sticky .h-page-width,
  .convertt-co-header.scrolled .h-page-width {
    border-radius: 10px;
    box-shadow: 0px 4px 14px 0px rgba(0,0,0,0.05);
    background: rgba(255,255,255,1);
    padding: 0 16px;
    max-width: 1360px;
  }
  @keyframes prismo-slide-down {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .convertt-header-roi,
    .convertt-co-header { top: 6px; height: 58px; }
    .h-page-width { padding: 0 16px; width: 100%; }
    .main-logo-sales { width: 101px; }
    .nav-list { display: none; }
    .nav-list.show {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 16px;
      position: absolute;
      top: 64px;
      left: 0;
      width: 100%;
      background: rgba(248,249,250,1);
      padding: 16px;
      height: 100vh;
      overflow-y: auto;
      z-index: 999;
    }
    .main-menu-header .menu-list { display: none; }
    .mobile-toggle,
    .hamburger-menu { display: block; }
    .btn-header { padding: 0 6px 0 16px; height: 32px; font-size: 12px; }
    .header-btn-svg { width: 20px; }
    .nav-item { display: block; height: auto; width: 100%; }
    .mega-wrapper {
      position: static;
      width: 100%;
      padding: 16px 0 0;
      box-shadow: none;
      background: #f9f9f9;
    }
    .row-grid { display: block; }
    .category-card { margin-bottom: 16px; }
    .results-grid-container { position: static; width: 100%; margin: 0 0 15px; padding: 15px; }
    .sub-grid { grid-template-columns: 1fr; }
    .is-sticky,
    .convertt-co-header.scrolled { top: -6px !important; }
    .is-sticky .h-page-width,
    .convertt-co-header.scrolled .h-page-width {
      border-radius: 0;
      padding: 0 16px;
      background: rgba(248,249,250,1);
      width: 100%;
    }
    .is-sticky.menu-open .h-page-width,
    .menu-open .h-page-width {
      background: rgba(248,249,250,1) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
  }
`;
