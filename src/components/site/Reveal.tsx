"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds the `in` class to every `.reveal` element when scrolled into view or on route change. */
export default function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -4% 0px", threshold: 0.02 }
    );

    const scan = () => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.05) {
          el.classList.add("in");
        } else {
          io.observe(el);
        }
      });
    };

    scan();
    const t = setTimeout(scan, 200);
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
