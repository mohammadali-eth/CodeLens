package com.codelens.service;

import com.codelens.dto.CreateRepositoryRequestRecord;
import com.codelens.dto.RepositoryResponseRecord;
import com.codelens.exception.BadRequestException;
import com.codelens.exception.ResourceNotFoundException;
import com.codelens.model.CodeRepository;
import com.codelens.model.User;
import com.codelens.repository.CodeRepositoryRepository;
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
 * Enterprise Unit Test Suite for CodeRepositoryServiceImpl.
 * Assures isolation by mocking database repositories using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class CodeRepositoryServiceImplTest {

    @Mock
    private CodeRepositoryRepository repositoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CodeRepositoryServiceImpl repositoryService;

    private User testUser;
    private CodeRepository testRepo;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testowner");
        testUser.setEmail("owner@codelens.com");

        testRepo = new CodeRepository("MyRepo", "My Repo Description", "Java", testUser, false);
        testRepo.setId(100L);
    }

    @Test
    void createRepository_Success() {
        CreateRepositoryRequestRecord request = new CreateRepositoryRequestRecord("MyRepo", "My Repo Description", "Java", false);

        when(userRepository.findByUsername("testowner")).thenReturn(Optional.of(testUser));
        when(repositoryRepository.existsByNameAndOwnerId("MyRepo", 1L)).thenReturn(false);
        when(repositoryRepository.save(any(CodeRepository.class))).thenReturn(testRepo);

        RepositoryResponseRecord response = repositoryService.createRepository("testowner", request);

        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("MyRepo");
        assertThat(response.programmingLanguage()).isEqualTo("Java");
        assertThat(response.ownerUsername()).isEqualTo("testowner");

        verify(userRepository, times(1)).findByUsername("testowner");
        verify(repositoryRepository, times(1)).existsByNameAndOwnerId("MyRepo", 1L);
        verify(repositoryRepository, times(1)).save(any(CodeRepository.class));
    }

    @Test
    void createRepository_ThrowsException_WhenNameAlreadyExists() {
        CreateRepositoryRequestRecord request = new CreateRepositoryRequestRecord("MyRepo", "My Repo Description", "Java", false);

        when(userRepository.findByUsername("testowner")).thenReturn(Optional.of(testUser));
        when(repositoryRepository.existsByNameAndOwnerId("MyRepo", 1L)).thenReturn(true);

        assertThatThrownBy(() -> repositoryService.createRepository("testowner", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already exists for user");

        verify(repositoryRepository, never()).save(any());
    }

    @Test
    void getRepositoryById_Success() {
        when(repositoryRepository.findById(100L)).thenReturn(Optional.of(testRepo));

        RepositoryResponseRecord response = repositoryService.getRepositoryById(100L, "testowner");

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(100L);
        assertThat(response.name()).isEqualTo("MyRepo");

        verify(repositoryRepository, times(1)).findById(100L);
    }

    @Test
    void getRepositoryById_ThrowsException_WhenNotFound() {
        when(repositoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> repositoryService.getRepositoryById(999L, "testowner"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Repository not found");
    }
}
