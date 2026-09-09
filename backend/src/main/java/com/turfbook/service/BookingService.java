package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.entity.*;
import com.turfbook.enums.*;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.*;
import java.math.*;
import java.time.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class BookingService {
  private final BookingRepository bookings; private final TimeSlotRepository slots; private final CurrentUserService currentUser; private final ResponseMapper mapper;
  @Transactional
  public BookingResponse create(CreateBookingRequest request) {
    UserAccount user = currentUser.require();
    TimeSlot slot = slots.findByIdForBooking(request.slotId()).orElseThrow(() -> ApiException.notFound("Time slot not found"));
    if (!slot.getTurf().isActive()) throw ApiException.badRequest("This turf is unavailable");
    if (!slot.isAvailable() || slot.getSlotDate().isBefore(LocalDate.now())) throw ApiException.conflict("This time slot is no longer available");
    BigDecimal price = slot.getPriceOverride() == null ? slot.getTurf().getPricePerHour() : slot.getPriceOverride();
    BigDecimal total = price.add(price.multiply(new BigDecimal("0.18"))).add(new BigDecimal("30.00")).setScale(2, RoundingMode.HALF_UP);
    Booking booking = new Booking(); booking.setUser(user); booking.setTurf(slot.getTurf()); booking.setSlot(slot); booking.setBookingDate(slot.getSlotDate());
    booking.setStatus(BookingStatus.CONFIRMED); booking.setPaymentStatus(PaymentStatus.PENDING); booking.setTotalAmount(total);
    slot.setAvailable(false); slot.setBookedBy(user);
    return mapper.booking(bookings.save(booking));
  }
  @Transactional(readOnly = true)
  public PageResponse<BookingResponse> mine(int page, int size) {
    Page<Booking> result = bookings.findByUserIdOrderByCreatedAtDesc(currentUser.id(), page(page, size));
    return PageResponse.from(result.map(mapper::booking));
  }
  @Transactional(readOnly = true)
  public BookingResponse detail(UUID bookingId) {
    Booking booking = bookings.findById(bookingId).orElseThrow(() -> ApiException.notFound("Booking not found"));
    if (!currentUser.hasRole("ADMIN") && !booking.getUser().getId().equals(currentUser.id())) throw ApiException.forbidden("You cannot view this booking");
    return mapper.booking(booking);
  }
  @Transactional
  public BookingResponse cancel(UUID bookingId) {
    Booking booking = bookings.findById(bookingId).orElseThrow(() -> ApiException.notFound("Booking not found"));
    if (!currentUser.hasRole("ADMIN") && !booking.getUser().getId().equals(currentUser.id())) throw ApiException.forbidden("You cannot cancel this booking");
    if (booking.getStatus() == BookingStatus.CANCELLED) return mapper.booking(booking);
    LocalDateTime slotStart = LocalDateTime.of(booking.getSlot().getSlotDate(), booking.getSlot().getStartTime());
    if (LocalDateTime.now().isAfter(slotStart.minusHours(6))) throw ApiException.badRequest("Bookings can only be cancelled at least 6 hours before the slot");
    booking.setStatus(BookingStatus.CANCELLED); booking.setPaymentStatus(booking.getPaymentStatus() == PaymentStatus.PAID ? PaymentStatus.REFUNDED : booking.getPaymentStatus());
    booking.getSlot().setAvailable(true); booking.getSlot().setBookedBy(null); return mapper.booking(booking);
  }
  @Transactional
  public BookingResponse confirm(UUID bookingId) {
    Booking booking = bookings.findById(bookingId).orElseThrow(() -> ApiException.notFound("Booking not found"));
    Turf turf = booking.getTurf();
    boolean ownsTurf = turf.getCreatedBy() != null && turf.getCreatedBy().getId().equals(currentUser.id());
    if (!currentUser.hasRole("ADMIN") && !ownsTurf) throw ApiException.forbidden("You cannot confirm this booking");
    if (booking.getStatus() == BookingStatus.CANCELLED) throw ApiException.badRequest("Cancelled bookings cannot be confirmed");
    booking.setStatus(BookingStatus.CONFIRMED); booking.getSlot().setAvailable(false); return mapper.booking(booking);
  }
  @Transactional(readOnly = true)
  public PageResponse<BookingResponse> adminList(BookingStatus status, int page, int size) {
    Page<Booking> result = status == null ? bookings.findAll(page(page, size)) : bookings.findByStatusOrderByCreatedAtDesc(status, page(page, size));
    return PageResponse.from(result.map(mapper::booking));
  }
  private Pageable page(int page, int size) { return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("createdAt").descending()); }
}
