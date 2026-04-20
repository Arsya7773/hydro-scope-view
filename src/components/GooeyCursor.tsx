import { useEffect, useRef } from "react";

/**
 * Gooey "ink" cursor: a leading dot follows the pointer, a trail of smaller
 * dots lags behind. The SVG goo filter merges them into a liquid blob.
 * Disabled on touch / coarse-pointer devices.
 */
const TRAIL = 6;

export const GooeyCursor = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLSpanElement[]>([]);
  const target = useRef({ x: -100, y: -100 });
  const positions = useRef(
    Array.from({ length: TRAIL + 1 }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      const pts = positions.current;
      // Lead dot tracks pointer almost instantly
      pts[0].x += (target.current.x - pts[0].x) * 0.35;
      pts[0].y += (target.current.y - pts[0].y) * 0.35;
      // Trail dots ease toward previous
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.35;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.35;
      }
      for (let i = 0; i < pts.length; i++) {
        const el = dots.current[i];
        if (el) el.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* SVG filter — exact gooey matrix from the brief */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="gooey-cursor-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div ref={wrap} className="GooeyCursor" aria-hidden>
        {Array.from({ length: TRAIL + 1 }).map((_, i) => (
          <span
            key={i}
            className={i === 0 ? "lead" : ""}
            ref={(el) => {
              if (el) dots.current[i] = el;
            }}
            style={{
              opacity: 1 - i * (0.7 / TRAIL),
            }}
          />
        ))}
      </div>
    </>
  );
};

export default GooeyCursor;
