package com.turfbook.entity;

import com.turfbook.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor
public class Booking {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private UserAccount user;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "turf_id", nullable = false) private Turf turf;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "slot_id", nullable = false) private TimeSlot slot;
  @Column(name = "booking_date", nullable = false) private LocalDate bookingDate;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private BookingStatus status;
  @Column(name = "total_amount", nullable = false, precision = 10, scale = 2) private BigDecimal totalAmount;
  @Enumerated(EnumType.STRING) @Column(name = "payment_status", nullable = false, length = 20) private PaymentStatus paymentStatus;
  @Column(name = "payment_reference", length = 150) private String paymentReference;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @Column(name = "updated_at", nullable = false) private Instant updatedAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
  @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
