package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "time_slots", uniqueConstraints = @UniqueConstraint(columnNames = {"turf_id", "slot_date", "start_time"}))
@Getter @Setter @NoArgsConstructor
public class TimeSlot {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "turf_id", nullable = false) private Turf turf;
  @Column(name = "slot_date", nullable = false) private LocalDate slotDate;
  @Column(name = "start_time", nullable = false) private LocalTime startTime;
  @Column(name = "end_time", nullable = false) private LocalTime endTime;
  @Column(name = "is_available", nullable = false) private boolean available = true;
  @Column(name = "price_override", precision = 10, scale = 2) private BigDecimal priceOverride;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booked_by") private UserAccount bookedBy;
  @Version private Long version;
}
