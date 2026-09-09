package com.turfbook.dto;

import java.time.Instant;
import java.util.List;

public record ApiResponse<T>(boolean success, String message, T data, List<String> errors, Instant timestamp) {
  public static <T> ApiResponse<T> ok(String message, T data) {
    return new ApiResponse<>(true, message, data, null, Instant.now());
  }
  public static ApiResponse<Void> error(String message, List<String> errors) {
    return new ApiResponse<>(false, message, null, errors, Instant.now());
  }
}
