package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.entity.*;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class ResponseMapper {
  private static final DateTimeFormatter SLOT_TIME = DateTimeFormatter.ofPattern("hh:mm a");
  public UserResponse user(UserAccount user) {
    return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getAvatarUrl(), user.isEmailVerified(),
        user.getRoles().stream().map(r -> r.getName().name()).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)));
  }
  public CityResponse city(City city) { return new CityResponse(city.getId(), city.getName(), city.getState(), city.getCountry(), city.getPincodePrefix()); }
  public FacilityResponse facility(Facility facility) { return new FacilityResponse(facility.getId(), facility.getName(), facility.getIcon()); }
  public TurfResponse turf(Turf turf, boolean availableToday) {
    return new TurfResponse(turf.getId(), turf.getName(), turf.getCity().getId(), turf.getCity().getName(), turf.getArea(), turf.getAddress(),
        turf.getSports().stream().map(Enum::name).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)), turf.getPricePerHour(), turf.getRating(), turf.getReviewCount(),
        List.copyOf(turf.getImageUrls()), turf.getFacilities().stream().map(Facility::getName).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)), availableToday);
  }
  public TurfDetailResponse turfDetail(Turf turf) {
    return new TurfDetailResponse(turf.getId(), turf.getName(), turf.getCity().getId(), turf.getCity().getName(), turf.getArea(), turf.getAddress(),
        turf.getLatitude(), turf.getLongitude(), turf.getSports().stream().map(Enum::name).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)),
        turf.getPricePerHour(), turf.getRating(), turf.getReviewCount(), turf.getDescription(), List.copyOf(turf.getImageUrls()),
        turf.getFacilities().stream().map(Facility::getName).collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)), turf.isActive());
  }
  public SlotResponse slot(TimeSlot slot) {
    BigDecimal price = slot.getPriceOverride() == null ? slot.getTurf().getPricePerHour() : slot.getPriceOverride();
    return new SlotResponse(slot.getId(), slot.getSlotDate(), slot.getStartTime(), slot.getEndTime(), SLOT_TIME.format(slot.getStartTime()) + " - " + SLOT_TIME.format(slot.getEndTime()), slot.isAvailable(), price);
  }
  public BookingResponse booking(Booking booking) {
    Turf turf = booking.getTurf();
    String image = turf.getImageUrls().isEmpty() ? null : turf.getImageUrls().getFirst();
    String sport = turf.getSports().isEmpty() ? "OTHER" : turf.getSports().iterator().next().name();
    return new BookingResponse(booking.getId(), turf.getId(), turf.getName(), turf.getArea(), sport, image, booking.getBookingDate(),
        SLOT_TIME.format(booking.getSlot().getStartTime()) + " - " + SLOT_TIME.format(booking.getSlot().getEndTime()), booking.getTotalAmount(), booking.getStatus(), booking.getPaymentStatus(), booking.getCreatedAt());
  }
  public ReviewResponse review(Review review) { return new ReviewResponse(review.getId(), review.getUser().getFullName(), review.getRating(), review.getComment(), review.getCreatedAt()); }
}
