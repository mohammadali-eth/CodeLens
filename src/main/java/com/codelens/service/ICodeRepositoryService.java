package com.codelens.service;

import com.codelens.dto.CreateRepositoryRequestRecord;
import com.codelens.dto.RepositoryResponseRecord;
import com.codelens.dto.UpdateRepositoryRequestRecord;

import java.util.List;

public interface ICodeRepositoryService {
    RepositoryResponseRecord createRepository(String ownerUsername, CreateRepositoryRequestRecord request);
    RepositoryResponseRecord getRepositoryById(Long repoId, String currentUsername);
    List<RepositoryResponseRecord> getUserRepositories(String ownerUsername);
    RepositoryResponseRecord updateRepository(Long repoId, String ownerUsername, UpdateRepositoryRequestRecord request);
    void deleteRepository(Long repoId, String ownerUsername);
}
