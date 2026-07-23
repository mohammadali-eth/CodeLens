package com.codelens.service;

import com.codelens.dto.UpdateProfileRequestRecord;
import com.codelens.dto.UserProfileResponseRecord;
import com.codelens.exception.ResourceNotFoundException;
import com.codelens.model.User;
import com.codelens.model.UserProfile;
import com.codelens.repository.UserProfileRepository;
import com.codelens.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Enterprise Unit Test Suite for UserProfileServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class UserProfileServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository profileRepository;

    @InjectMocks
    private UserProfileServiceImpl profileService;

    private User testUser;
    private UserProfile testProfile;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testProfile = new UserProfile(testUser, "John", "Doe");
        testUser.setProfile(testProfile);
    }

    @Test
    void getUserProfile_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserProfileResponseRecord response = profileService.getUserProfileByUsername("testuser");

        assertThat(response).isNotNull();
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.lastName()).isEqualTo("Doe");

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void getUserProfile_ThrowsException_WhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getUserProfileByUsername("unknown"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateUserProfile_Success() {
        UpdateProfileRequestRecord request = new UpdateProfileRequestRecord("Jane", "Doe", "Principal Architect", "Engineering", "Some Bio", "github_jane");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(profileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileResponseRecord response = profileService.updateUserProfile("testuser", request);

        assertThat(response).isNotNull();
        assertThat(response.firstName()).isEqualTo("Jane");
        assertThat(response.lastName()).isEqualTo("Doe");

        verify(profileRepository, times(1)).save(any(UserProfile.class));
    }
}
