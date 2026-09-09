CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  full_name VARCHAR(80) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(1000),
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token_id VARCHAR(100) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(100) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE cities (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  pincode_prefix VARCHAR(12),
  CONSTRAINT uq_city_name_state UNIQUE(name, state)
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(100)
);

CREATE TABLE turfs (
  id UUID PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id),
  area VARCHAR(120) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price_per_hour NUMERIC(10,2) NOT NULL CHECK (price_per_hour >= 0),
  rating NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  description TEXT,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  version BIGINT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_turfs_city_active ON turfs(city_id, is_active);
CREATE INDEX idx_turfs_area ON turfs(area);

CREATE TABLE turf_sports (
  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  sport_type VARCHAR(30) NOT NULL,
  PRIMARY KEY (turf_id, sport_type)
);
CREATE INDEX idx_turf_sports_sport ON turf_sports(sport_type);

CREATE TABLE turf_images (
  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  PRIMARY KEY (turf_id, display_order)
);

CREATE TABLE turf_facilities (
  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  PRIMARY KEY (turf_id, facility_id)
);

CREATE TABLE time_slots (
  id UUID PRIMARY KEY,
  turf_id UUID NOT NULL REFERENCES turfs(id),
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  price_override NUMERIC(10,2),
  booked_by UUID REFERENCES users(id),
  version BIGINT,
  CONSTRAINT uq_turf_slot_start UNIQUE(turf_id, slot_date, start_time),
  CONSTRAINT chk_slot_time CHECK(end_time > start_time)
);
CREATE INDEX idx_time_slots_turf_date_available ON time_slots(turf_id, slot_date, is_available);

CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  turf_id UUID NOT NULL REFERENCES turfs(id),
  slot_id UUID NOT NULL REFERENCES time_slots(id),
  booking_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL CHECK(total_amount >= 0),
  payment_status VARCHAR(20) NOT NULL,
  payment_reference VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_turf ON bookings(turf_id);
CREATE UNIQUE INDEX uq_bookings_live_slot ON bookings(slot_id) WHERE status <> 'CANCELLED';

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  turf_id UUID NOT NULL REFERENCES turfs(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT uq_review_turf_user UNIQUE(turf_id, user_id)
);
CREATE INDEX idx_reviews_turf ON reviews(turf_id);

CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
