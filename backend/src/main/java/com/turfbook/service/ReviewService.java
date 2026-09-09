package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.entity.*;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.*;
import java.math.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ReviewService {
  private final ReviewRepository reviews; private final TurfRepository turfs; private final CurrentUserService currentUser; private final ResponseMapper mapper;
  @Transactional public ReviewResponse create(UUID turfId, CreateReviewRequest request) {
    Turf turf = turfs.findById(turfId).filter(Turf::isActive).orElseThrow(() -> ApiException.notFound("Turf not found"));
    UserAccount user = currentUser.require();
    if (reviews.existsByTurfIdAndUserId(turfId, user.getId())) throw ApiException.conflict("You have already reviewed this turf");
    Review review = new Review(); review.setTurf(turf); review.setUser(user); review.setRating(request.rating()); review.setComment(request.comment() == null ? null : request.comment().trim()); reviews.save(review);
    Double average = reviews.averageRating(turfId); turf.setRating(BigDecimal.valueOf(average == null ? 0 : average).setScale(1, RoundingMode.HALF_UP)); turf.setReviewCount((int) reviews.countByTurfId(turfId));
    return mapper.review(review);
  }
  @Transactional(readOnly = true) public PageResponse<ReviewResponse> list(UUID turfId, int page, int size) {
    if (!turfs.existsById(turfId)) throw ApiException.notFound("Turf not found");
    return PageResponse.from(reviews.findByTurfIdOrderByCreatedAtDesc(turfId, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50))).map(mapper::review));
  }
}
