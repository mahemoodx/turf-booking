package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.enums.BookingStatus;
import com.turfbook.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor @PreAuthorize("hasRole('ADMIN')")
public class AdminController {
  private final AdminService admin; private final BookingService bookings;
  @GetMapping("/dashboard") public ApiResponse<DashboardResponse> dashboard() { return ApiResponse.ok("Dashboard retrieved", admin.dashboard()); }
  @GetMapping("/users") public ApiResponse<PageResponse<UserResponse>> users(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) { return ApiResponse.ok("Users retrieved", admin.users(page, size)); }
  @GetMapping("/bookings") public ApiResponse<PageResponse<BookingResponse>> bookings(@RequestParam(required = false) BookingStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) { return ApiResponse.ok("Bookings retrieved", bookings.adminList(status, page, size)); }
}
