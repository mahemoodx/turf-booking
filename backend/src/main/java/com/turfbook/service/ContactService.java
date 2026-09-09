package com.turfbook.service;

import com.turfbook.dto.ApiDtos.ContactRequest;
import com.turfbook.entity.ContactInquiry;
import com.turfbook.repository.ContactInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class ContactService {
  private final ContactInquiryRepository inquiries;
  public void create(ContactRequest request) {
    ContactInquiry inquiry = new ContactInquiry(); inquiry.setName(request.name().trim()); inquiry.setEmail(request.email().trim().toLowerCase());
    inquiry.setPhone(request.phone() == null || request.phone().isBlank() ? null : request.phone().trim()); inquiry.setSubject(request.subject().trim()); inquiry.setMessage(request.message().trim()); inquiries.save(inquiry);
  }
}
