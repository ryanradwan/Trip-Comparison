const PREMIUM_KEY = "tce_premium";
const ANNUAL_KEY = "tce_premium_annual";

export function isPremiumUnlocked(slug?: string): boolean {
  if (typeof window === "undefined") return false;
  // Annual subscription unlocks everything
  const annual = localStorage.getItem(ANNUAL_KEY);
  if (annual) {
    try {
      const { expiry } = JSON.parse(annual);
      if (new Date(expiry) > new Date()) return true;
    } catch { /* ignore */ }
  }
  // Single comparison unlock
  if (slug) {
    const single = localStorage.getItem(`${PREMIUM_KEY}_${slug}`);
    if (single) return true;
  }
  return false;
}

export function unlockPremium(type: "single" | "annual", slug?: string): void {
  if (typeof window === "undefined") return;
  if (type === "annual") {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    localStorage.setItem(ANNUAL_KEY, JSON.stringify({ expiry: expiry.toISOString() }));
  } else if (slug) {
    localStorage.setItem(`${PREMIUM_KEY}_${slug}`, "1");
  }
}

export function isAnnualSubscriber(): boolean {
  if (typeof window === "undefined") return false;
  const annual = localStorage.getItem(ANNUAL_KEY);
  if (!annual) return false;
  try {
    const { expiry } = JSON.parse(annual);
    return new Date(expiry) > new Date();
  } catch {
    return false;
  }
}
