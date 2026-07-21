package com.codelens.service;

import com.codelens.dto.CreateRepositoryRequestRecord;
import com.codelens.dto.RepositoryResponseRecord;
import com.codelens.dto.UpdateRepositoryRequestRecord;
import com.codelens.exception.BadRequestException;
import com.codelens.exception.ResourceNotFoundException;
import com.codelens.model.CodeRepository;
import com.codelens.model.User;
import com.codelens.repository.CodeRepositoryRepository;
import com.codelens.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Enterprise Service Implementation managing Code Repository CRUD operations and validation logic.
 */
@Service
public class CodeRepositoryServiceImpl implements ICodeRepositoryService {

    private static final Logger log = LoggerFactory.getLogger(CodeRepositoryServiceImpl.class);

    private final CodeRepositoryRepository repositoryRepository;
    private final UserRepository userRepository;

    public CodeRepositoryServiceImpl(CodeRepositoryRepository repositoryRepository, UserRepository userRepository) {
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RepositoryResponseRecord createRepository(String ownerUsername, CreateRepositoryRequestRecord request) {
        log.info("Creating new repository '{}' for owner '{}'", request.name(), ownerUsername);

        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));

        if (repositoryRepository.existsByNameAndOwnerId(request.name(), owner.getId())) {
            throw new BadRequestException("Repository with name '" + request.name() + "' already exists for user '" + ownerUsername + "'");
        }

        CodeRepository repository = new CodeRepository(
                request.name(),
                request.description(),
                request.programmingLanguage().toUpperCase(),
                owner,
                request.isPublic()
        );

        CodeRepository savedRepo = repositoryRepository.save(repository);
        log.info("Repository '{}' successfully created with ID {}", savedRepo.getName(), savedRepo.getId());

        return mapToResponseRecord(savedRepo);
    }

    @Override
    @Transactional(readOnly = true)
    public RepositoryResponseRecord getRepositoryById(Long repoId, String currentUsername) {
        log.debug("Fetching repository ID {} for user '{}'", repoId, currentUsername);

        CodeRepository repository = repositoryRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", "id", repoId));

        if (!repository.isPublic() && !repository.getOwner().getUsername().equals(currentUsername)) {
            throw new ResourceNotFoundException("Repository", "id", repoId);
        }

        return mapToResponseRecord(repository);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RepositoryResponseRecord> getUserRepositories(String ownerUsername) {
        log.debug("Fetching all repositories for user '{}'", ownerUsername);
        List<CodeRepository> repositories = repositoryRepository.findByOwnerUsername(ownerUsername);
        return repositories.stream().map(this::mapToResponseRecord).toList();
    }

    @Override
    @Transactional
    public RepositoryResponseRecord updateRepository(Long repoId, String ownerUsername, UpdateRepositoryRequestRecord request) {
        log.info("Updating repository ID {} for owner '{}'", repoId, ownerUsername);

        CodeRepository repository = repositoryRepository.findByIdAndOwnerUsername(repoId, ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", "id", repoId));

        if (!repository.getName().equalsIgnoreCase(request.name()) &&
                repositoryRepository.existsByNameAndOwnerUsername(request.name(), ownerUsername)) {
            throw new BadRequestException("Repository name '" + request.name() + "' is already in use by user '" + ownerUsername + "'");
        }

        repository.setName(request.name());
        repository.setDescription(request.description());
        repository.setProgrammingLanguage(request.programmingLanguage().toUpperCase());
        repository.setPublic(request.isPublic());

        CodeRepository updatedRepo = repositoryRepository.save(repository);
        log.info("Repository ID {} successfully updated", updatedRepo.getId());

        return mapToResponseRecord(updatedRepo);
    }

    @Override
    @Transactional
    public void deleteRepository(Long repoId, String ownerUsername) {
        log.info("Deleting repository ID {} for owner '{}'", repoId, ownerUsername);

        CodeRepository repository = repositoryRepository.findByIdAndOwnerUsername(repoId, ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", "id", repoId));

        repositoryRepository.delete(repository);
        log.info("Repository ID {} successfully deleted", repoId);
    }

    private RepositoryResponseRecord mapToResponseRecord(CodeRepository repository) {
        return new RepositoryResponseRecord(
                repository.getId(),
                repository.getName(),
                repository.getDescription(),
                repository.getProgrammingLanguage(),
                repository.getOwner().getId(),
                repository.getOwner().getUsername(),
                repository.isPublic(),
                repository.getCreatedAt(),
                repository.getUpdatedAt()
        );
    }
}
