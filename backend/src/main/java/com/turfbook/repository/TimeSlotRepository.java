package com.turfbook.repository;

import com.turfbook.entity.TimeSlot;
import java.time.LocalDate;
import java.util.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {
  List<TimeSlot> findByTurfIdAndSlotDateOrderByStartTime(UUID turfId, LocalDate slotDate);
  boolean existsByTurfIdAndSlotDate(UUID turfId, LocalDate slotDate);
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from TimeSlot s join fetch s.turf where s.id = :id")
  Optional<TimeSlot> findByIdForBooking(UUID id);
  long countByTurfIdAndSlotDateAndAvailableTrue(UUID turfId, LocalDate date);
}
