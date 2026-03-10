// src/components/Marquee.jsx
import { useEffect, useRef } from "react";

export default function Marquee({ images = [] }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;

    // Remove any old clones before adding a new one
    track.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());

    const original = track.querySelector(".marquee-content");
    if (!original) return;

    const clone = original.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }, [images]);

  if (!images.length) return null;

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track" ref={trackRef}>
          <div className="marquee-content">
            {images.map((img, index) => (
              <div className="product-card" key={index}>
                <img
                  src={img?.url || ""}
                  alt={img?.alt || `Product ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
