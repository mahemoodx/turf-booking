-- Keep sports as reference data even though a turf may support more than one sport.
CREATE TABLE sports (
  id UUID PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  display_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO sports (id, code, display_name) VALUES
  ('40000000-0000-0000-0000-000000000001', 'FOOTBALL', 'Football'),
  ('40000000-0000-0000-0000-000000000002', 'CRICKET', 'Cricket'),
  ('40000000-0000-0000-0000-000000000003', 'BADMINTON', 'Badminton'),
  ('40000000-0000-0000-0000-000000000004', 'TENNIS', 'Tennis'),
  ('40000000-0000-0000-0000-000000000005', 'BASKETBALL', 'Basketball'),
  ('40000000-0000-0000-0000-000000000006', 'VOLLEYBALL', 'Volleyball'),
  ('40000000-0000-0000-0000-000000000007', 'PICKLEBALL', 'Pickleball');

-- The API calls these submitted contact messages; rename the original table so
-- the physical schema uses that same, more user-facing term.
ALTER TABLE contact_inquiries RENAME TO contact_messages;
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
