const SELLER_SESSION_KEY = "sellerSession";

export const getSellerSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELLER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSellerSession = (seller) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SELLER_SESSION_KEY, JSON.stringify(seller));
};

export const clearSellerSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SELLER_SESSION_KEY);
};

export const isSellerLoggedIn = () => Boolean(getSellerSession()?.sellerId || getSellerSession()?.id);
