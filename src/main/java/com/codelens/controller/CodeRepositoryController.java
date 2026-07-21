package com.codelens.controller;

import com.codelens.dto.CreateRepositoryRequestRecord;
import com.codelens.dto.RepositoryResponseRecord;
import com.codelens.dto.UpdateRepositoryRequestRecord;
import com.codelens.service.ICodeRepositoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller managing Code Repository CRUD operations.
 */
@RestController
@RequestMapping("/api/v1/repositories")
public class CodeRepositoryController {

    private static final Logger log = LoggerFactory.getLogger(CodeRepositoryController.class);

    private final ICodeRepositoryService repositoryService;

    public CodeRepositoryController(ICodeRepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    /**
     * Creates a new Code Repository for the authenticated user.
     *
     * @param userDetails Authenticated user details
     * @param request Repository creation payload
     * @return ResponseEntity with created RepositoryResponseRecord
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RepositoryResponseRecord> createRepository(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRepositoryRequestRecord request) {
        log.info("REST Request to create repository for user: {}", userDetails.getUsername());
        RepositoryResponseRecord response = repositoryService.createRepository(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Retrieves all repositories owned by the authenticated user.
     *
     * @param userDetails Authenticated user details
     * @return ResponseEntity containing list of RepositoryResponseRecord
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RepositoryResponseRecord>> getCurrentUserRepositories(
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST Request to get all repositories for user: {}", userDetails.getUsername());
        List<RepositoryResponseRecord> repositories = repositoryService.getUserRepositories(userDetails.getUsername());
        return ResponseEntity.ok(repositories);
    }

    /**
     * Retrieves a specific repository by ID.
     *
     * @param repoId Repository ID
     * @param userDetails Authenticated user details
     * @return ResponseEntity containing RepositoryResponseRecord
     */
    @GetMapping("/{repoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RepositoryResponseRecord> getRepositoryById(
            @PathVariable Long repoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST Request to get repository ID {} for user: {}", repoId, userDetails.getUsername());
        RepositoryResponseRecord response = repositoryService.getRepositoryById(repoId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Updates an existing repository owned by the authenticated user.
     *
     * @param repoId Repository ID
     * @param userDetails Authenticated user details
     * @param request Update payload
     * @return ResponseEntity containing updated RepositoryResponseRecord
     */
    @PutMapping("/{repoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RepositoryResponseRecord> updateRepository(
            @PathVariable Long repoId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateRepositoryRequestRecord request) {
        log.info("REST Request to update repository ID {} for user: {}", repoId, userDetails.getUsername());
        RepositoryResponseRecord response = repositoryService.updateRepository(repoId, userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a repository owned by the authenticated user.
     *
     * @param repoId Repository ID
     * @param userDetails Authenticated user details
     * @return ResponseEntity with No Content (204)
     */
    @DeleteMapping("/{repoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteRepository(
            @PathVariable Long repoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST Request to delete repository ID {} for user: {}", repoId, userDetails.getUsername());
        repositoryService.deleteRepository(repoId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
