const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:9090/api").replace(
  /\/$/,
  "",
);
const ACCESS_KEY = "turfbook.access-token";
const REFRESH_KEY = "turfbook.refresh-token";

export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const isBrowser = () => typeof window !== "undefined";

export const session = {
  accessToken: () => (isBrowser() ? localStorage.getItem(ACCESS_KEY) : null),
  refreshToken: () => (isBrowser() ? localStorage.getItem(REFRESH_KEY) : null),
  save: ({ accessToken, refreshToken }) => {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

async function parse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.message || "The request could not be completed",
      response.status,
      body?.errors || [],
    );
  }
  return body.data;
}

async function refreshAccessToken() {
  const refreshToken = session.refreshToken();
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await parse(response);
    session.save(data);
    return true;
  } catch {
    session.clear();
    return false;
  }
}

export async function request(path, options = {}, retryOnUnauthorized = true) {
  const headers = new Headers(options.headers || {});
  const token = session.accessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Cannot reach TurfBook. Start the backend and try again.");
  }
  if (response.status === 401 && retryOnUnauthorized && token && (await refreshAccessToken())) {
    return request(path, options, false);
  }
  return parse(response);
}

const queryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    if (Array.isArray(value)) value.forEach((entry) => entry && query.append(key, entry));
    else query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : "";
};

const normaliseTurf = (turf) => ({
  id: String(turf.id),
  name: turf.name,
  location: turf.cityName,
  area: turf.area,
  address: turf.address,
  sport: (turf.sports?.[0] || "OTHER").toLowerCase(),
  sports: (turf.sports || []).map((sport) => sport.toLowerCase()),
  price: Number(turf.pricePerHour),
  rating: Number(turf.rating),
  reviews: turf.reviewCount,
  images: turf.imageUrls?.length ? turf.imageUrls : ["/favicon.ico"],
  facilities: turf.facilities || [],
  availableToday: Boolean(turf.availableToday),
  description: turf.description || "",
});

const normaliseSlot = (slot) => ({ ...slot, id: String(slot.id), price: Number(slot.price) });

export const normaliseBooking = (booking) => ({
  id: String(booking.id),
  turfId: String(booking.turfId),
  turfName: booking.turfName,
  location: booking.location,
  sport: booking.sport.toLowerCase(),
  image: booking.imageUrl,
  date: booking.date,
  slot: booking.slot,
  amount: Number(booking.amount),
  status:
    booking.status === "COMPLETED"
      ? "completed"
      : booking.status === "CANCELLED"
        ? "cancelled"
        : "upcoming",
  paymentStatus: booking.paymentStatus,
  createdAt: booking.createdAt,
});

export const authApi = {
  async login(credentials) {
    const data = await request(
      "/auth/login",
      { method: "POST", body: JSON.stringify(credentials) },
      false,
    );
    session.save(data);
    return data;
  },
  async register(details) {
    const data = await request(
      "/auth/register",
      { method: "POST", body: JSON.stringify(details) },
      false,
    );
    session.save(data);
    return data;
  },
  me: () => request("/auth/me"),
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }, false),
  resetPassword: (token, password) =>
    request(
      "/auth/reset-password",
      { method: "POST", body: JSON.stringify({ token, password }) },
      false,
    ),
  async logout() {
    const refreshToken = session.refreshToken();
    try {
      if (refreshToken)
        await request(
          "/auth/logout",
          { method: "POST", body: JSON.stringify({ refreshToken }) },
          false,
        );
    } finally {
      session.clear();
    }
  },
};

export const turfApi = {
  async list(filters = {}) {
    const data = await request(`/turfs${queryString(filters)}`);
    return { ...data, content: data.content.map(normaliseTurf) };
  },
  async detail(id) {
    return normaliseTurf(await request(`/turfs/${id}`));
  },
  async slots(id, date) {
    return (await request(`/turfs/${id}/slots${queryString({ date })}`)).map(normaliseSlot);
  },
  cities: () => request("/cities"),
  facilities: () => request("/facilities"),
  sports: () => request("/sports"),
};

export const bookingApi = {
  async create(slotId) {
    return normaliseBooking(
      await request("/bookings", { method: "POST", body: JSON.stringify({ slotId }) }),
    );
  },
  async mine() {
    const data = await request("/bookings?size=100");
    return data.content.map(normaliseBooking);
  },
  async cancel(id) {
    return normaliseBooking(await request(`/bookings/${id}/cancel`, { method: "PATCH" }));
  },
};

export const contactApi = {
  create: (form) => request("/contact", { method: "POST", body: JSON.stringify(form) }),
};
export const adminApi = {
  dashboard: () => request("/admin/dashboard"),
  users: () => request("/admin/users?size=10"),
  bookings: () => request("/admin/bookings?size=10"),
};
