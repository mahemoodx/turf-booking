package com.turfbook.dto;

import com.turfbook.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.domain.Page;

/** Request/response shapes kept independent of the persistence model. */
public final class ApiDtos {
  private ApiDtos() {}

  public record RegisterRequest(@NotBlank @Size(min = 3, max = 80) String fullName,
                                @NotBlank @Email @Size(max = 255) String email,
                                @NotBlank @Pattern(regexp = "^[6-9][0-9]{9}$", message = "must be a valid 10-digit Indian mobile number") String phone,
                                @NotBlank @Size(min = 8, max = 72) String password) {}
  public record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 72) String password) {}
  public record GoogleLoginRequest(@NotBlank @Size(max = 4096) String credential) {}
  public record RefreshRequest(@NotBlank String refreshToken) {}
  public record ForgotPasswordRequest(@NotBlank @Email String email) {}
  public record ResetPasswordRequest(@NotBlank String token, @NotBlank @Size(min = 8, max = 72) String password) {}
  public record VerifyEmailRequest(@NotBlank String token) {}
  public record ContactRequest(@NotBlank @Size(max = 100) String name, @NotBlank @Email String email,
                               @Pattern(regexp = "^$|^[0-9+\\s-]{7,20}$", message = "must be a valid phone number") String phone,
                               @NotBlank @Size(max = 150) String subject, @NotBlank @Size(min = 10, max = 1000) String message) {}
  public record CreateBookingRequest(@NotNull UUID slotId) {}
  public record CreateReviewRequest(@Min(1) @Max(5) int rating, @Size(max = 1000) String comment) {}
  public record SlotInput(@NotNull LocalTime startTime, @NotNull LocalTime endTime, @DecimalMin("0.00") BigDecimal priceOverride) {}
  public record CreateSlotsRequest(@NotNull LocalDate date, @NotEmpty List<@Valid SlotInput> slots) {}
  public record UpdateSlotRequest(Boolean available, @DecimalMin("0.00") BigDecimal priceOverride) {}
  public record TurfRequest(@NotBlank @Size(max = 150) String name, @NotNull UUID cityId, @NotBlank @Size(max = 120) String area,
                            @NotBlank @Size(max = 500) String address, Double latitude, Double longitude,
                            @NotEmpty Set<SportType> sports, @NotNull @DecimalMin("0.00") BigDecimal pricePerHour,
                            @Size(max = 5000) String description, List<@NotBlank @Size(max = 1000) String> imageUrls,
                            Set<@NotBlank String> facilities) {}
  public record UpdateTurfRequest(@Size(min = 2, max = 150) String name, UUID cityId, @Size(max = 120) String area,
                                  @Size(max = 500) String address, Double latitude, Double longitude, Set<SportType> sports,
                                  @DecimalMin("0.00") BigDecimal pricePerHour, @Size(max = 5000) String description,
                                  List<@NotBlank @Size(max = 1000) String> imageUrls, Set<@NotBlank String> facilities) {}

  public record UserResponse(UUID id, String fullName, String email, String phone, String avatarUrl,
                             boolean emailVerified, Set<String> roles) {}
  public record TokenResponse(String accessToken, String refreshToken, UserResponse user) {}
  public record CityResponse(UUID id, String name, String state, String country, String pincodePrefix) {}
  public record FacilityResponse(UUID id, String name, String icon) {}
  public record TurfResponse(UUID id, String name, UUID cityId, String cityName, String area, String address,
                             Set<String> sports, BigDecimal pricePerHour, BigDecimal rating, int reviewCount,
                             List<String> imageUrls, Set<String> facilities, boolean availableToday) {}
  public record TurfDetailResponse(UUID id, String name, UUID cityId, String cityName, String area, String address,
                                   Double latitude, Double longitude, Set<String> sports, BigDecimal pricePerHour,
                                   BigDecimal rating, int reviewCount, String description, List<String> imageUrls,
                                   Set<String> facilities, boolean active) {}
  public record SlotResponse(UUID id, LocalDate date, LocalTime startTime, LocalTime endTime, String label,
                             boolean available, BigDecimal price) {}
  public record BookingResponse(UUID id, UUID turfId, String turfName, String location, String sport, String imageUrl,
                                LocalDate date, String slot, BigDecimal amount, BookingStatus status,
                                PaymentStatus paymentStatus, Instant createdAt) {}
  public record ReviewResponse(UUID id, String userName, int rating, String comment, Instant createdAt) {}
  public record DashboardResponse(long totalUsers, long totalTurfs, long totalBookings, BigDecimal revenue) {}
  public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
    public static <T> PageResponse<T> from(Page<T> page) {
      return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }
  }
}
