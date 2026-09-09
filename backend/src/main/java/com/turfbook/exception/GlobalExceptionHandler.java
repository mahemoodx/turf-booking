package com.turfbook.exception;

import com.turfbook.dto.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import java.util.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ApiException.class)
  ResponseEntity<ApiResponse<Void>> api(ApiException ex) {
    return ResponseEntity.status(ex.getStatus()).body(ApiResponse.error(ex.getMessage(), List.of()));
  }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException ex) {
    List<String> errors = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage()).toList();
    return ResponseEntity.badRequest().body(ApiResponse.error("Validation failed", errors));
  }
  @ExceptionHandler(ConstraintViolationException.class)
  ResponseEntity<ApiResponse<Void>> constraint(ConstraintViolationException ex) {
    return ResponseEntity.badRequest().body(ApiResponse.error("Validation failed", ex.getConstraintViolations().stream()
        .map(v -> v.getPropertyPath() + ": " + v.getMessage()).toList()));
  }
  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiResponse<Void>> denied(AccessDeniedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You do not have permission for this action", List.of()));
  }
  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ApiResponse<Void>> duplicate(DataIntegrityViolationException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("The request conflicts with existing data", List.of()));
  }
  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiResponse<Void>> unexpected(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("An unexpected error occurred", List.of()));
  }
}
