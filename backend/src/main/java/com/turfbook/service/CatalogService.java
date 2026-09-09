package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.enums.SportType;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class CatalogService {
  private final CityRepository cities; private final FacilityRepository facilities; private final TurfRepository turfs; private final ResponseMapper mapper;
  @Transactional(readOnly = true) public List<CityResponse> cities() { return cities.findAllByOrderByNameAsc().stream().map(mapper::city).toList(); }
  @Transactional(readOnly = true) public List<FacilityResponse> facilities() { return facilities.findAllByOrderByNameAsc().stream().map(mapper::facility).toList(); }
  public List<String> sports() { return Arrays.stream(SportType.values()).map(Enum::name).toList(); }
  @Transactional(readOnly = true) public List<String> areas(UUID cityId) {
    if (!cities.existsById(cityId)) throw ApiException.notFound("City not found");
    return turfs.findDistinctAreasByCityId(cityId);
  }
}
