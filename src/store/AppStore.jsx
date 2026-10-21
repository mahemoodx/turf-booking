import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, bookingApi, session } from "@/lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: "", email: "", phone: "", roles: [], loggedIn: false });
  const [bookings, setBookings] = useState([]);
  const [draft, setDraft] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setAuthenticatedUser = (account) => {
    setUser({ name: account.fullName, email: account.email, phone: account.phone || "", roles: account.roles || [], loggedIn: true });
  };
  useEffect(() => {
    if (!session.accessToken()) { setAuthLoading(false); return; }
    authApi.me().then(setAuthenticatedUser).catch(() => session.clear()).finally(() => setAuthLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login: async (credentials) => { const result = await authApi.login(credentials); setAuthenticatedUser(result.user); return result.user; },
      googleLogin: async (credential) => { const result = await authApi.google(credential); setAuthenticatedUser(result.user); return result.user; },
      register: async (details) => { const result = await authApi.register(details); setAuthenticatedUser(result.user); return result.user; },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          setUser({ name: "", email: "", phone: "", roles: [], loggedIn: false });
          setBookings([]);
        }
      },
      bookings,
      draft,
      setDraft,
      lastBooking,
      loadBookings: async () => { const list = await bookingApi.mine(); setBookings(list); return list; },
      confirmBooking: async (slotId) => {
        const booking = await bookingApi.create(slotId);
        setBookings((b) => [booking, ...b]); setLastBooking(booking);
        setDraft(null);
        return booking;
      },
      cancelBooking: async (id) => { const cancelled = await bookingApi.cancel(id); setBookings((b) => b.map((x) => x.id === id ? cancelled : x)); return cancelled; },
    }),
    [user, bookings, draft, lastBooking, authLoading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
