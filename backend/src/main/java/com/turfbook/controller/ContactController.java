package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.ContactRequest;
import com.turfbook.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/contact") @RequiredArgsConstructor
public class ContactController {
  private final ContactService contact;
  @PostMapping public ApiResponse<Void> create(@Valid @RequestBody ContactRequest request) { contact.create(request); return ApiResponse.ok("Message received. Our team will reply within 24 hours.", null); }
}
