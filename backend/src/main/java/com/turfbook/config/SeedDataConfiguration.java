package com.turfbook.config;

import com.turfbook.entity.*;
import com.turfbook.enums.RoleName;
import com.turfbook.repository.*;
import java.time.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration @RequiredArgsConstructor
public class SeedDataConfiguration {
  private final UserRepository users; private final RoleRepository roles; private final TurfRepository turfs;
  private final TimeSlotRepository slots; private final PasswordEncoder passwords;
  @Bean CommandLineRunner seedApplicationData() {
    return args -> { seedUsers(); seedUpcomingSlots(); };
  }
  private void seedUsers() {
    createUserIfMissing("admin@turfbook.com", "TurfBook Admin", "+918179469535", "Admin@123", RoleName.ADMIN);
    createUserIfMissing("admin@gmail.com", "Mahemood Admin", "+918179469535", "Mahemood", RoleName.ADMIN);
    createUserIfMissing("user@turfbook.com", "TurfBook User", "+919999999999", "User@123", RoleName.USER);
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
