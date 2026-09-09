package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.entity.*;
import com.turfbook.enums.SportType;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.*;
import jakarta.persistence.criteria.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class TurfService {
  private final TurfRepository turfs; private final CityRepository cities; private final FacilityRepository facilities;
  private final TimeSlotRepository slots; private final CurrentUserService currentUser; private final ResponseMapper mapper;

  @Transactional(readOnly = true)
  public PageResponse<TurfResponse> list(String city, List<SportType> sports, String area, String query, BigDecimal minPrice,
                                         BigDecimal maxPrice, BigDecimal minRating, List<String> facilityNames, boolean availableToday,
                                         LocalDate date, LocalTime startTime, String order, int page, int size) {
    Sort sort = switch (order == null ? "recommended" : order) {
      case "price-low" -> Sort.by("pricePerHour").ascending();
      case "price-high" -> Sort.by("pricePerHour").descending();
      case "rating" -> Sort.by("rating").descending().and(Sort.by("reviewCount").descending());
      default -> Sort.by("rating").descending().and(Sort.by("reviewCount").descending());
    };
    Page<Turf> result = turfs.findAll(specification(city, sports, area, query, minPrice, maxPrice, minRating, facilityNames, availableToday, date, startTime),
        PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50), sort));
    return PageResponse.from(result.map(turf -> mapper.turf(turf, slots.countByTurfIdAndSlotDateAndAvailableTrue(turf.getId(), LocalDate.now()) > 0)));
  }
  @Transactional(readOnly = true)
  public TurfDetailResponse detail(UUID turfId) { return mapper.turfDetail(activeTurf(turfId)); }
  @Transactional(readOnly = true)
  public List<SlotResponse> slots(UUID turfId, LocalDate date) {
    activeTurf(turfId);
    return slots.findByTurfIdAndSlotDateOrderByStartTime(turfId, date).stream().map(mapper::slot).toList();
  }
  @Transactional
  public TurfDetailResponse create(TurfRequest request) {
    Turf turf = new Turf(); apply(turf, request.name(), request.cityId(), request.area(), request.address(), request.latitude(), request.longitude(), request.sports(), request.pricePerHour(), request.description(), request.imageUrls(), request.facilities());
    turf.setCreatedBy(currentUser.require());
    return mapper.turfDetail(turfs.save(turf));
  }
  @Transactional
  public TurfDetailResponse update(UUID id, UpdateTurfRequest request) {
    Turf turf = activeTurf(id); assertCanManage(turf);
    apply(turf, request.name() == null ? turf.getName() : request.name(), request.cityId() == null ? turf.getCity().getId() : request.cityId(),
        request.area() == null ? turf.getArea() : request.area(), request.address() == null ? turf.getAddress() : request.address(),
        request.latitude() == null ? turf.getLatitude() : request.latitude(), request.longitude() == null ? turf.getLongitude() : request.longitude(),
        request.sports() == null ? turf.getSports() : request.sports(), request.pricePerHour() == null ? turf.getPricePerHour() : request.pricePerHour(),
        request.description() == null ? turf.getDescription() : request.description(), request.imageUrls() == null ? turf.getImageUrls() : request.imageUrls(),
        request.facilities() == null ? turf.getFacilities().stream().map(Facility::getName).collect(java.util.stream.Collectors.toSet()) : request.facilities());
    return mapper.turfDetail(turf);
  }
  @Transactional
  public void softDelete(UUID id) { Turf turf = activeTurf(id); assertCanManage(turf); turf.setActive(false); }
  @Transactional
  public List<SlotResponse> addSlots(UUID turfId, CreateSlotsRequest request) {
    Turf turf = activeTurf(turfId); assertCanManage(turf);
    if (request.date().isBefore(LocalDate.now())) throw ApiException.badRequest("Slots cannot be created in the past");
    if (slots.existsByTurfIdAndSlotDate(turfId, request.date())) throw ApiException.conflict("Slots already exist for this turf and date");
    Set<java.time.LocalTime> starts = new HashSet<>();
    List<TimeSlot> list = request.slots().stream().map(input -> {
      if (!input.endTime().isAfter(input.startTime()) || !starts.add(input.startTime())) throw ApiException.badRequest("Slots must have unique, valid start and end times");
      TimeSlot slot = new TimeSlot(); slot.setTurf(turf); slot.setSlotDate(request.date()); slot.setStartTime(input.startTime()); slot.setEndTime(input.endTime()); slot.setPriceOverride(input.priceOverride()); return slot;
    }).toList();
    return slots.saveAll(list).stream().map(mapper::slot).toList();
  }
  @Transactional
  public SlotResponse updateSlot(UUID slotId, UpdateSlotRequest request) {
    TimeSlot slot = slots.findById(slotId).orElseThrow(() -> ApiException.notFound("Time slot not found")); assertCanManage(slot.getTurf());
    if (request.available() != null) slot.setAvailable(request.available()); if (request.priceOverride() != null) slot.setPriceOverride(request.priceOverride()); return mapper.slot(slot);
  }
  private void apply(Turf turf, String name, UUID cityId, String area, String address, Double latitude, Double longitude,
                     Set<SportType> sportTypes, BigDecimal price, String description, List<String> images, Set<String> facilityNames) {
    City city = cities.findById(cityId).orElseThrow(() -> ApiException.badRequest("Selected city does not exist"));
    List<Facility> resolvedFacilities = facilityNames == null ? List.of() : facilities.findByNameIn(facilityNames);
    if (facilityNames != null && resolvedFacilities.size() != facilityNames.size()) throw ApiException.badRequest("One or more facilities do not exist");
    turf.setName(name.trim()); turf.setCity(city); turf.setArea(area.trim()); turf.setAddress(address.trim()); turf.setLatitude(latitude); turf.setLongitude(longitude);
    turf.setSports(new LinkedHashSet<>(sportTypes)); turf.setPricePerHour(price); turf.setDescription(description == null ? null : description.trim());
    turf.setImageUrls(images == null ? new ArrayList<>() : new ArrayList<>(images)); turf.setFacilities(new LinkedHashSet<>(resolvedFacilities));
  }
  private Turf activeTurf(UUID id) {
    Turf turf = turfs.findWithRelationsById(id).orElseThrow(() -> ApiException.notFound("Turf not found"));
    if (!turf.isActive()) throw ApiException.notFound("Turf not found"); return turf;
  }
  private void assertCanManage(Turf turf) {
    if (currentUser.hasRole("ADMIN")) return;
    if (turf.getCreatedBy() != null && turf.getCreatedBy().getId().equals(currentUser.id())) return;
    throw ApiException.forbidden("You can manage only turfs you own");
  }
  private Specification<Turf> specification(String city, List<SportType> sportTypes, String area, String query, BigDecimal minPrice,
                                             BigDecimal maxPrice, BigDecimal minRating, List<String> facilityNames, boolean availableToday,
                                             LocalDate date, LocalTime startTime) {
    return (root, criteria, cb) -> {
      criteria.distinct(true); List<Predicate> filters = new ArrayList<>(); filters.add(cb.isTrue(root.get("active")));
      Join<Turf, City> cityJoin = root.join("city", JoinType.INNER);
      if (city != null && !city.isBlank()) filters.add(cb.equal(cb.lower(cityJoin.get("name")), city.trim().toLowerCase(Locale.ROOT)));
      if (area != null && !area.isBlank()) filters.add(cb.like(cb.lower(root.get("area")), "%" + area.trim().toLowerCase(Locale.ROOT) + "%"));
      if (query != null && !query.isBlank()) { String like = "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
        filters.add(cb.or(cb.like(cb.lower(root.get("name")), like), cb.like(cb.lower(root.get("area")), like), cb.like(cb.lower(cityJoin.get("name")), like))); }
      if (sportTypes != null && !sportTypes.isEmpty()) filters.add(root.join("sports").in(sportTypes));
      if (minPrice != null) filters.add(cb.greaterThanOrEqualTo(root.get("pricePerHour"), minPrice));
      if (maxPrice != null) filters.add(cb.lessThanOrEqualTo(root.get("pricePerHour"), maxPrice));
      if (minRating != null) filters.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
      if (facilityNames != null && !facilityNames.isEmpty()) for (String facilityName : facilityNames) {
        Join<Turf, Facility> facility = root.join("facilities", JoinType.INNER);
        filters.add(cb.equal(cb.lower(facility.get("name")), facilityName.toLowerCase(Locale.ROOT)));
      }
      if (availableToday || date != null || startTime != null) {
        Subquery<UUID> available = criteria.subquery(UUID.class); Root<TimeSlot> slot = available.from(TimeSlot.class);
        List<Predicate> slotFilters = new ArrayList<>();
        slotFilters.add(cb.equal(slot.get("turf").get("id"), root.get("id")));
        slotFilters.add(cb.equal(slot.get("slotDate"), date == null ? LocalDate.now() : date));
        slotFilters.add(cb.isTrue(slot.get("available")));
        if (startTime != null) slotFilters.add(cb.equal(slot.get("startTime"), startTime));
        available.select(slot.get("id")).where(slotFilters.toArray(Predicate[]::new));
        filters.add(cb.exists(available));
      }
      return cb.and(filters.toArray(Predicate[]::new));
    };
  }
}
