package com.codelens.controller;

import com.codelens.dto.UpdateProfileRequestRecord;
import com.codelens.dto.UserProfileResponseRecord;
import com.codelens.service.IUserProfileService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing user profile retrieval and update endpoints.
 */
@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private static final Logger log = LoggerFactory.getLogger(UserProfileController.class);

    private final IUserProfileService userProfileService;

    public UserProfileController(IUserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     *
     * @param userDetails Authenticated user principal details
     * @return ResponseEntity containing UserProfileResponseRecord
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponseRecord> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST Request to get profile for current user: {}", userDetails.getUsername());
        UserProfileResponseRecord profile = userProfileService.getUserProfileByUsername(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    /**
     * Updates the profile of the currently authenticated user.
     *
     * @param userDetails Authenticated user principal details
     * @param updateRequest Validated profile update payload
     * @return ResponseEntity containing updated UserProfileResponseRecord
     */
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponseRecord> updateCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequestRecord updateRequest) {
        log.info("REST Request to update profile for current user: {}", userDetails.getUsername());
        UserProfileResponseRecord updatedProfile = userProfileService.updateUserProfile(userDetails.getUsername(), updateRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Retrieves profile metadata by user ID (Accessible by authenticated users).
     *
     * @param userId Target user ID
     * @return ResponseEntity containing UserProfileResponseRecord
     */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponseRecord> getUserProfileById(@PathVariable Long userId) {
        log.info("REST Request to get profile for user ID: {}", userId);
        UserProfileResponseRecord profile = userProfileService.getUserProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }
}
