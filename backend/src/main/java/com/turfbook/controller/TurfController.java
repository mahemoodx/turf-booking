package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.enums.SportType;
import com.turfbook.service.TurfService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/turfs") @RequiredArgsConstructor
public class TurfController {
  private final TurfService turfs;
  @GetMapping public ApiResponse<PageResponse<TurfResponse>> list(
      @RequestParam(required = false) String city, @RequestParam(required = false) SportType sport,
      @RequestParam(required = false) List<SportType> sports, @RequestParam(required = false) String area,
      @RequestParam(required = false, name = "q") String query, @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice, @RequestParam(required = false, name = "rating") BigDecimal minRating,
      @RequestParam(required = false, name = "facility") List<String> facilities, @RequestParam(defaultValue = "false") boolean availableToday,
      @RequestParam(required = false) LocalDate date, @RequestParam(required = false) LocalTime startTime,
      @RequestParam(defaultValue = "recommended") String order, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
    List<SportType> selectedSports = new ArrayList<>(sports == null ? List.of() : sports); if (sport != null) selectedSports.add(sport);
    return ApiResponse.ok("Turfs retrieved", turfs.list(city, selectedSports, area, query, minPrice, maxPrice, minRating, facilities, availableToday, date, startTime, order, page, size));
  }
  @GetMapping("/{id}") public ApiResponse<TurfDetailResponse> detail(@PathVariable UUID id) { return ApiResponse.ok("Turf retrieved", turfs.detail(id)); }
  @GetMapping("/{turfId}/slots") public ApiResponse<List<SlotResponse>> slots(@PathVariable UUID turfId, @RequestParam LocalDate date) { return ApiResponse.ok("Time slots retrieved", turfs.slots(turfId, date)); }
  @PostMapping @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')") public ApiResponse<TurfDetailResponse> create(@Valid @RequestBody TurfRequest request) { return ApiResponse.ok("Turf created", turfs.create(request)); }
  @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')") public ApiResponse<TurfDetailResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateTurfRequest request) { return ApiResponse.ok("Turf updated", turfs.update(id, request)); }
  @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')") public ApiResponse<Void> delete(@PathVariable UUID id) { turfs.softDelete(id); return ApiResponse.ok("Turf deactivated", null); }
  @PostMapping("/{turfId}/slots") @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')") public ApiResponse<List<SlotResponse>> addSlots(@PathVariable UUID turfId, @Valid @RequestBody CreateSlotsRequest request) { return ApiResponse.ok("Slots created", turfs.addSlots(turfId, request)); }
}
