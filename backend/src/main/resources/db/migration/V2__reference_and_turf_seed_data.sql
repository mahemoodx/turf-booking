INSERT INTO roles (id, name) VALUES
 ('00000000-0000-0000-0000-000000000001', 'ADMIN'),
 ('00000000-0000-0000-0000-000000000002', 'USER'),
 ('00000000-0000-0000-0000-000000000003', 'VENUE_OWNER');

INSERT INTO cities (id, name, state, country, pincode_prefix) VALUES
 ('10000000-0000-0000-0000-000000000001', 'Hyderabad', 'Telangana', 'India', '500'),
 ('10000000-0000-0000-0000-000000000002', 'Bengaluru', 'Karnataka', 'India', '560'),
 ('10000000-0000-0000-0000-000000000003', 'Chennai', 'Tamil Nadu', 'India', '600'),
 ('10000000-0000-0000-0000-000000000004', 'Mumbai', 'Maharashtra', 'India', '400'),
 ('10000000-0000-0000-0000-000000000005', 'Pune', 'Maharashtra', 'India', '411'),
 ('10000000-0000-0000-0000-000000000006', 'Delhi', 'Delhi', 'India', '110'),
 ('10000000-0000-0000-0000-000000000007', 'Kochi', 'Kerala', 'India', '682');

INSERT INTO facilities (id, name, icon) VALUES
 ('20000000-0000-0000-0000-000000000001', 'Floodlights', 'lightbulb'),
 ('20000000-0000-0000-0000-000000000002', 'Parking', 'car'),
 ('20000000-0000-0000-0000-000000000003', 'Changing Room', 'shirt'),
 ('20000000-0000-0000-0000-000000000004', 'Washroom', 'bath'),
 ('20000000-0000-0000-0000-000000000005', 'Drinking Water', 'droplets'),
 ('20000000-0000-0000-0000-000000000006', 'Equipment Rental', 'dumbbell'),
 ('20000000-0000-0000-0000-000000000007', 'Seating', 'armchair'),
 ('20000000-0000-0000-0000-000000000008', 'Coaching Available', 'badge'),
 ('20000000-0000-0000-0000-000000000009', 'Cafe', 'coffee');

INSERT INTO turfs (id, name, city_id, area, address, price_per_hour, rating, review_count, description, is_active, version, created_at, updated_at) VALUES
 ('30000000-0000-0000-0000-000000000001','Stadium Arena Gachibowli','10000000-0000-0000-0000-000000000001','Gachibowli, Hyderabad','Gachibowli, Hyderabad',550,4.5,187,'Full-size artificial football turf with premium floodlights and instant slot confirmation.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000002','StrikeZone Cricket Nets','10000000-0000-0000-0000-000000000001','Kondapur, Hyderabad','Kondapur, Hyderabad',900,4.6,143,'Covered box-cricket ground with practice nets and spectator seating.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000003','Madhapur Play Factory','10000000-0000-0000-0000-000000000001','Madhapur, Hyderabad','Madhapur, Hyderabad',700,4.4,257,'Shock-absorbing football grass, high-mast lighting and clean facilities.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000004','SmashPoint Badminton Club','10000000-0000-0000-0000-000000000001','Hitech City, Hyderabad','Hitech City, Hyderabad',600,4.7,133,'Indoor synthetic badminton courts with pro lighting and racket rental.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000005','Koramangala Football Hub','10000000-0000-0000-0000-000000000002','Koramangala, Bengaluru','Koramangala, Bengaluru',850,4.8,219,'Five-a-side football venue near Koramangala with evening floodlights.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000006','Indiranagar Sports Box','10000000-0000-0000-0000-000000000002','Indiranagar, Bengaluru','Indiranagar, Bengaluru',1100,4.3,81,'Multi-sport box for cricket and football with parking and water.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000007','Whitefield Shuttle Arena','10000000-0000-0000-0000-000000000002','Whitefield, Bengaluru','Whitefield, Bengaluru',650,4.5,98,'Airy indoor badminton courts with changing rooms and coaching.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000008','GreenField Arena','10000000-0000-0000-0000-000000000003','Anna Nagar, Chennai','Anna Nagar, Chennai',1200,4.6,187,'A well-maintained football ground for friendly matches and leagues.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000009','Marina Turf Club','10000000-0000-0000-0000-000000000003','Besant Nagar, Chennai','Besant Nagar, Chennai',1050,4.4,169,'Ocean-side football turf with floodlights and a comfortable lounge.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000010','Velachery Cricket Park','10000000-0000-0000-0000-000000000003','Velachery, Chennai','Velachery, Chennai',950,4.2,75,'Box cricket space with bowling net, seating and equipment hire.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000011','Bandra Kickoff Arena','10000000-0000-0000-0000-000000000004','Bandra West, Mumbai','Bandra West, Mumbai',1600,4.8,304,'Premium five-a-side football turf with excellent turf quality.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000012','Andheri Indoor Courts','10000000-0000-0000-0000-000000000004','Andheri East, Mumbai','Andheri East, Mumbai',800,4.5,155,'Indoor badminton court with reliable lighting and showers.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000013','Powai Sports Yard','10000000-0000-0000-0000-000000000004','Powai, Mumbai','Powai, Mumbai',1450,4.7,211,'Flexible multi-sport venue for football, cricket and events.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000014','Baner Play Arena','10000000-0000-0000-0000-000000000005','Baner, Pune','Baner, Pune',900,4.6,164,'Modern football turf with parking, cafe and equipment rental.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000015','Koregaon Park Courts','10000000-0000-0000-0000-000000000005','Koregaon Park, Pune','Koregaon Park, Pune',750,4.4,119,'All-weather tennis courts with seating and coaching options.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000016','Hinjewadi Cricket Box','10000000-0000-0000-0000-000000000005','Hinjewadi, Pune','Hinjewadi, Pune',1100,4.3,96,'Box cricket court close to IT park with late evening slots.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000017','Dwarka Sports Arena','10000000-0000-0000-0000-000000000006','Dwarka, Delhi','Dwarka, Delhi',1250,4.7,228,'Large football turf built for leagues, training and tournaments.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000018','Saket Shuttle Club','10000000-0000-0000-0000-000000000006','Saket, Delhi','Saket, Delhi',700,4.5,102,'Professional indoor badminton facility with racket rental.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000019','Kakkanad Turf Arena','10000000-0000-0000-0000-000000000007','Kakkanad, Kochi','Kakkanad, Kochi',800,4.6,145,'Premium football turf with parking, water and late slots.',TRUE,0,NOW(),NOW()),
 ('30000000-0000-0000-0000-000000000020','Fort Kochi Sports Club','10000000-0000-0000-0000-000000000007','Fort Kochi, Kochi','Fort Kochi, Kochi',750,4.4,88,'Community sports club for football and badminton near Fort Kochi.',TRUE,0,NOW(),NOW());

INSERT INTO turf_sports(turf_id, sport_type)
SELECT id, CASE ((substring(id::text from 35 for 2))::int % 5)
  WHEN 0 THEN 'FOOTBALL' WHEN 1 THEN 'CRICKET' WHEN 2 THEN 'BADMINTON' WHEN 3 THEN 'TENNIS' ELSE 'BASKETBALL' END
FROM turfs;
INSERT INTO turf_sports(turf_id, sport_type) VALUES
 ('30000000-0000-0000-0000-000000000002','FOOTBALL'),
 ('30000000-0000-0000-0000-000000000006','CRICKET'),
 ('30000000-0000-0000-0000-000000000013','CRICKET'),
 ('30000000-0000-0000-0000-000000000020','BADMINTON');

INSERT INTO turf_images(turf_id, display_order, image_url)
SELECT id, 0, 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1400&q=85' FROM turfs;
INSERT INTO turf_images(turf_id, display_order, image_url)
SELECT id, 1, 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1400&q=85' FROM turfs;

INSERT INTO turf_facilities(turf_id, facility_id)
SELECT id, '20000000-0000-0000-0000-000000000002'::uuid FROM turfs;
INSERT INTO turf_facilities(turf_id, facility_id)
SELECT id, '20000000-0000-0000-0000-000000000005'::uuid FROM turfs;
INSERT INTO turf_facilities(turf_id, facility_id)
SELECT id, '20000000-0000-0000-0000-000000000001'::uuid FROM turfs WHERE price_per_hour >= 800;
INSERT INTO turf_facilities(turf_id, facility_id)
SELECT id, '20000000-0000-0000-0000-000000000003'::uuid FROM turfs WHERE price_per_hour >= 900;
