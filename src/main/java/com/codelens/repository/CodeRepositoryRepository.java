package com.codelens.repository;

import com.codelens.model.CodeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepositoryRepository extends JpaRepository<CodeRepository, Long> {
    List<CodeRepository> findByOwnerUsername(String username);
    long countByOwnerUsername(String username);
    Optional<CodeRepository> findByIdAndOwnerUsername(Long id, String username);
    boolean existsByNameAndOwnerId(String name, Long ownerId);
    boolean existsByNameAndOwnerUsername(String name, String username);
}
