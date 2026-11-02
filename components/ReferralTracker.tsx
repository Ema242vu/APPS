"use client";

import { useEffect } from "react";
import { trackReferralEvent, trackVisit } from "@/lib/referrals/client";

/**
 * Captura el ?ref= de la URL, registra la visita y cuenta clics en enlaces
 * de anuncios que se abren como <a href="..."> en cualquier parte del sitio.
 */
export default function ReferralTracker() {
  useEffect(() => {
    trackVisit();

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (/omg10\.com|bellnewyork\.org|5gvci\.com/i.test(href)) {
        trackReferralEvent("ad_click");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
