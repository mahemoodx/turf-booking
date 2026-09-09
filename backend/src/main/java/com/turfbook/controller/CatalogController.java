package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.service.CatalogService;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class CatalogController {
  private final CatalogService catalog;
  @GetMapping("/cities") public ApiResponse<List<CityResponse>> cities() { return ApiResponse.ok("Cities retrieved", catalog.cities()); }
  @GetMapping("/cities/{cityId}/areas") public ApiResponse<List<String>> areas(@PathVariable UUID cityId) { return ApiResponse.ok("Areas retrieved", catalog.areas(cityId)); }
  @GetMapping("/sports") public ApiResponse<List<String>> sports() { return ApiResponse.ok("Sports retrieved", catalog.sports()); }
  @GetMapping("/facilities") public ApiResponse<List<FacilityResponse>> facilities() { return ApiResponse.ok("Facilities retrieved", catalog.facilities()); }
}
