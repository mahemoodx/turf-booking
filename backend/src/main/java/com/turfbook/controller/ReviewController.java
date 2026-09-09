package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.service.ReviewService;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/turfs/{turfId}/reviews") @RequiredArgsConstructor
public class ReviewController {
  private final ReviewService reviews;
  @GetMapping public ApiResponse<PageResponse<ReviewResponse>> list(@PathVariable UUID turfId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) { return ApiResponse.ok("Reviews retrieved", reviews.list(turfId, page, size)); }
  @PostMapping @PreAuthorize("isAuthenticated()") public ApiResponse<ReviewResponse> create(@PathVariable UUID turfId, @Valid @RequestBody CreateReviewRequest request) { return ApiResponse.ok("Review added", reviews.create(turfId, request)); }
}
