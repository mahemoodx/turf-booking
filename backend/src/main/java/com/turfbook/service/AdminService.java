package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.enums.*;
import com.turfbook.repository.*;
import java.math.BigDecimal;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class AdminService {
  private final UserRepository users; private final TurfRepository turfs; private final BookingRepository bookings; private final ResponseMapper mapper;
  @Transactional(readOnly = true) public DashboardResponse dashboard() {
    BigDecimal revenue = bookings.revenueFor(Set.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED), PaymentStatus.PAID);
    return new DashboardResponse(users.count(), turfs.countByActiveTrue(), bookings.count(), revenue);
  }
  @Transactional(readOnly = true) public PageResponse<UserResponse> users(int page, int size) {
    return PageResponse.from(users.findAll(PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("createdAt").descending())).map(mapper::user));
  }
}
