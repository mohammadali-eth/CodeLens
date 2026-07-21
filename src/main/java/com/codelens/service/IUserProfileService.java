package com.codelens.service;

import com.codelens.dto.UpdateProfileRequestRecord;
import com.codelens.dto.UserProfileResponseRecord;

public interface IUserProfileService {
    UserProfileResponseRecord getUserProfileByUsername(String username);
    UserProfileResponseRecord getUserProfileByUserId(Long userId);
    UserProfileResponseRecord updateUserProfile(String username, UpdateProfileRequestRecord updateRequest);
}
