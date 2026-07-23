package com.codelens.service;

import com.codelens.dto.UpdateProfileRequestRecord;
import com.codelens.dto.UserProfileResponseRecord;
import com.codelens.exception.ResourceNotFoundException;
import com.codelens.model.User;
import com.codelens.model.UserProfile;
import com.codelens.repository.UserProfileRepository;
import com.codelens.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.codelens.config.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enterprise Service Implementation managing User Profile retrieval and transactional updates.
 */
@Service
public class UserProfileServiceImpl implements IUserProfileService {

    private static final Logger log = LoggerFactory.getLogger(UserProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.CACHE_USER_PROFILES, key = "#username")
    public UserProfileResponseRecord getUserProfileByUsername(String username) {
        log.debug("Fetching user profile for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile(user, "", "");
        }

        return mapToResponseRecord(user, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseRecord getUserProfileByUserId(Long userId) {
        log.debug("Fetching user profile for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile(user, "", "");
        }

        return mapToResponseRecord(user, profile);
    }

    @Override
    @Transactional
    @CacheEvict(value = CacheConfig.CACHE_USER_PROFILES, key = "#username")
    public UserProfileResponseRecord updateUserProfile(String username, UpdateProfileRequestRecord updateRequest) {
        log.info("Updating user profile for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        profile.setFirstName(updateRequest.firstName());
        profile.setLastName(updateRequest.lastName());
        profile.setJobTitle(updateRequest.jobTitle());
        profile.setDepartment(updateRequest.department());
        profile.setBio(updateRequest.bio());
        profile.setGithubProfileUrl(updateRequest.githubProfileUrl());

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("User profile successfully updated for username: {}", username);

        return mapToResponseRecord(user, savedProfile);
    }

    private UserProfileResponseRecord mapToResponseRecord(User user, UserProfile profile) {
        return new UserProfileResponseRecord(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getJobTitle(),
                profile.getDepartment(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.getGithubProfileUrl(),
                user.getCreatedAt()
        );
    }
}
