package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.service.BookingService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/bookings") @RequiredArgsConstructor
public class BookingController {
  private final BookingService bookings;
  @PostMapping public ApiResponse<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request) { return ApiResponse.ok("Booking confirmed", bookings.create(request)); }
  @GetMapping public ApiResponse<PageResponse<BookingResponse>> mine(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) { return ApiResponse.ok("Bookings retrieved", bookings.mine(page, size)); }
  @GetMapping("/{id}") public ApiResponse<BookingResponse> detail(@PathVariable UUID id) { return ApiResponse.ok("Booking retrieved", bookings.detail(id)); }
  @PatchMapping("/{id}/cancel") public ApiResponse<BookingResponse> cancel(@PathVariable UUID id) { return ApiResponse.ok("Booking cancelled", bookings.cancel(id)); }
  @PatchMapping("/{id}/confirm") @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')") public ApiResponse<BookingResponse> confirm(@PathVariable UUID id) { return ApiResponse.ok("Booking confirmed", bookings.confirm(id)); }
}
