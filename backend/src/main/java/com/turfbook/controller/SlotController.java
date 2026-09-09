package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.service.TurfService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/slots") @RequiredArgsConstructor
public class SlotController {
  private final TurfService turfs;
  @PatchMapping("/{slotId}") @PreAuthorize("hasAnyRole('ADMIN','VENUE_OWNER')")
  public ApiResponse<SlotResponse> update(@PathVariable UUID slotId, @Valid @RequestBody UpdateSlotRequest request) { return ApiResponse.ok("Slot updated", turfs.updateSlot(slotId, request)); }
}
