package com.turfbook.repository;

import com.turfbook.entity.Booking;
import com.turfbook.enums.*;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
  Page<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
  Page<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status, Pageable pageable);
  @Query("select coalesce(sum(b.totalAmount), 0) from Booking b where b.status in :statuses and b.paymentStatus = :paymentStatus")
  BigDecimal revenueFor(Set<BookingStatus> statuses, PaymentStatus paymentStatus);
}
