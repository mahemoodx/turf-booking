package com.turfbook.config;

import com.turfbook.entity.*;
import com.turfbook.enums.RoleName;
import com.turfbook.enums.SportType;
import com.turfbook.repository.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration @RequiredArgsConstructor
public class SeedDataConfiguration {
  private final UserRepository users; private final RoleRepository roles; private final TurfRepository turfs;
  private final TimeSlotRepository slots; private final CityRepository cities; private final FacilityRepository facilities;
  private final PasswordEncoder passwords;
  @Bean CommandLineRunner seedApplicationData() {
    return args -> { seedRoles(); seedCatalog(); seedUsers(); disableLegacyAdmin(); seedUpcomingSlots(); };
  }
  private void seedRoles() { for (RoleName name : RoleName.values()) if (roles.findByName(name).isEmpty()) roles.save(new Role(null, name)); }
  private void seedCatalog() {
    if (cities.count() == 0) cities.saveAll(List.of(
      city("Hyderabad", "Telangana", "500"), city("Bengaluru", "Karnataka", "560"), city("Chennai", "Tamil Nadu", "600"),
      city("Mumbai", "Maharashtra", "400"), city("Pune", "Maharashtra", "411"), city("Delhi", "Delhi", "110"), city("Kochi", "Kerala", "682")));
    if (facilities.count() == 0) facilities.saveAll(List.of(
      facility("Floodlights", "lightbulb"), facility("Parking", "car"), facility("Changing Room", "shirt"), facility("Washroom", "bath"),
      facility("Drinking Water", "droplets"), facility("Equipment Rental", "dumbbell"), facility("Seating", "armchair"),
      facility("Coaching Available", "badge"), facility("Cafe", "coffee")));
    if (turfs.count() > 0) return;
    Map<String, City> byCity = new HashMap<>(); cities.findAll().forEach(city -> byCity.put(city.getName(), city));
    Set<Facility> allFacilities = new HashSet<>(facilities.findAll());
    addTurf(byCity.get("Hyderabad"), "Stadium Arena Gachibowli", "Gachibowli, Hyderabad", 550, 4.5, SportType.CRICKET, allFacilities);
    addTurf(byCity.get("Hyderabad"), "StrikeZone Cricket Nets", "Kondapur, Hyderabad", 900, 4.6, SportType.FOOTBALL, allFacilities);
    addTurf(byCity.get("Hyderabad"), "Madhapur Play Factory", "Madhapur, Hyderabad", 700, 4.4, SportType.TENNIS, allFacilities);
    addTurf(byCity.get("Hyderabad"), "SmashPoint Badminton Club", "Hitech City, Hyderabad", 600, 4.7, SportType.BASKETBALL, allFacilities);
    addTurf(byCity.get("Bengaluru"), "Koramangala Football Hub", "Koramangala, Bengaluru", 850, 4.8, SportType.FOOTBALL, allFacilities);
    addTurf(byCity.get("Bengaluru"), "Indiranagar Sports Box", "Indiranagar, Bengaluru", 1100, 4.3, SportType.CRICKET, allFacilities);
    addTurf(byCity.get("Bengaluru"), "Whitefield Shuttle Arena", "Whitefield, Bengaluru", 650, 4.5, SportType.BADMINTON, allFacilities);
    addTurf(byCity.get("Chennai"), "GreenField Arena", "Anna Nagar, Chennai", 1200, 4.6, SportType.TENNIS, allFacilities);
    addTurf(byCity.get("Chennai"), "Marina Turf Club", "Besant Nagar, Chennai", 1050, 4.4, SportType.BASKETBALL, allFacilities);
    addTurf(byCity.get("Chennai"), "Velachery Cricket Park", "Velachery, Chennai", 950, 4.2, SportType.FOOTBALL, allFacilities);
    addTurf(byCity.get("Mumbai"), "Bandra Kickoff Arena", "Bandra West, Mumbai", 1600, 4.8, SportType.CRICKET, allFacilities);
    addTurf(byCity.get("Mumbai"), "Andheri Indoor Courts", "Andheri East, Mumbai", 800, 4.5, SportType.BADMINTON, allFacilities);
    addTurf(byCity.get("Mumbai"), "Powai Sports Yard", "Powai, Mumbai", 1450, 4.7, SportType.TENNIS, allFacilities);
    addTurf(byCity.get("Pune"), "Baner Play Arena", "Baner, Pune", 900, 4.6, SportType.BASKETBALL, allFacilities);
    addTurf(byCity.get("Pune"), "Koregaon Park Courts", "Koregaon Park, Pune", 750, 4.4, SportType.FOOTBALL, allFacilities);
    addTurf(byCity.get("Pune"), "Hinjewadi Cricket Box", "Hinjewadi, Pune", 1100, 4.3, SportType.CRICKET, allFacilities);
    addTurf(byCity.get("Delhi"), "Dwarka Sports Arena", "Dwarka, Delhi", 1250, 4.7, SportType.BADMINTON, allFacilities);
    addTurf(byCity.get("Delhi"), "Saket Shuttle Club", "Saket, Delhi", 700, 4.5, SportType.TENNIS, allFacilities);
    addTurf(byCity.get("Kochi"), "Kakkanad Turf Arena", "Kakkanad, Kochi", 800, 4.6, SportType.BASKETBALL, allFacilities);
    addTurf(byCity.get("Kochi"), "Fort Kochi Sports Club", "Fort Kochi, Kochi", 750, 4.4, SportType.FOOTBALL, allFacilities);
  }
  private City city(String name, String state, String prefix) { City city = new City(); city.setName(name); city.setState(state); city.setPincodePrefix(prefix); return city; }
  private Facility facility(String name, String icon) { Facility facility = new Facility(); facility.setName(name); facility.setIcon(icon); return facility; }
  private void addTurf(City city, String name, String area, double price, double rating, SportType sport, Set<Facility> amenities) {
    Turf turf = new Turf(); turf.setName(name); turf.setCity(city); turf.setArea(area); turf.setAddress(area); turf.setPricePerHour(BigDecimal.valueOf(price)); turf.setRating(BigDecimal.valueOf(rating));
    turf.setReviewCount((int) (rating * 40)); turf.setDescription("Quality sports venue with instant booking, well-maintained facilities and convenient slots."); turf.setSports(new LinkedHashSet<>(Set.of(sport)));
    turf.setFacilities(new HashSet<>(amenities)); turf.setImageUrls(new ArrayList<>(List.of("https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1400&q=85"))); turfs.save(turf);
  }
  private void seedUsers() {
    createUserIfMissing("admin@gmail.com", "Mahemood Admin", "+918179469535", "Mahemood", RoleName.ADMIN);
    createUserIfMissing("user@turfbook.com", "TurfBook User", "+919999999999", "User@123", RoleName.USER);
  }
  private void disableLegacyAdmin() {
    users.findByEmailIgnoreCase("admin@turfbook.com").ifPresent(account -> {
      account.setActive(false);
      account.setRoles(new HashSet<>(Set.of(roles.findByName(RoleName.USER).orElseThrow())));
      users.save(account);
    });
  }
  private void createUserIfMissing(String email, String name, String phone, String password, RoleName roleName) {
    if (users.existsByEmailIgnoreCase(email)) return;
    UserAccount user = new UserAccount(); user.setEmail(email); user.setFullName(name); user.setPhone(phone); user.setEmailVerified(true);
    user.setPasswordHash(passwords.encode(password)); user.setRoles(new HashSet<>(Set.of(roles.findByName(roleName).orElseThrow()))); users.save(user);
  }
  private void seedUpcomingSlots() {
    if (slots.count() > 0) return;
    List<TimeSlot> generated = new ArrayList<>();
    List<LocalTime> starts = List.of(LocalTime.of(6, 0), LocalTime.of(7, 0), LocalTime.of(8, 0), LocalTime.of(17, 0), LocalTime.of(18, 0), LocalTime.of(19, 0), LocalTime.of(20, 0));
    for (Turf turf : turfs.findAll()) for (int offset = 0; offset < 7; offset++) for (LocalTime start : starts) {
      TimeSlot slot = new TimeSlot(); slot.setTurf(turf); slot.setSlotDate(LocalDate.now().plusDays(offset)); slot.setStartTime(start); slot.setEndTime(start.plusHours(1)); generated.add(slot);
    }
    slots.saveAll(generated);
  }
}
