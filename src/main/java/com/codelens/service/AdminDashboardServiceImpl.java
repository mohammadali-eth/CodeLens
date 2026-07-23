package com.codelens.service;

import com.codelens.dto.AdminDashboardSummaryRecord;
import com.codelens.dto.AdminRecentActionRecord;
import com.codelens.repository.CodeRepositoryRepository;
import com.codelens.repository.CodeReviewRepository;
import com.codelens.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Enterprise Service Implementation providing aggregated global statistics and system health signals.
 */
@Service
public class AdminDashboardServiceImpl implements IAdminDashboardService {

    private static final Logger log = LoggerFactory.getLogger(AdminDashboardServiceImpl.class);

    private final UserRepository userRepository;
    private final CodeRepositoryRepository repositoryRepository;
    private final CodeReviewRepository reviewRepository;

    public AdminDashboardServiceImpl(UserRepository userRepository, CodeRepositoryRepository repositoryRepository, CodeReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.repositoryRepository = repositoryRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardSummaryRecord getAdminDashboardSummary() {
        log.info("Generating global admin dashboard summary and system metrics...");

        long totalUsers = userRepository.count();
        long totalRepositories = repositoryRepository.count();
        long totalReviews = reviewRepository.count();

        // System telemetry simulations
        long activeSessions = 12L; 
        String databaseHealthStatus = "UP";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String nowStr = LocalDateTime.now().format(formatter);

        List<AdminRecentActionRecord> recentActions = List.of(
                new AdminRecentActionRecord("USER_LOGIN", "system_admin", "SUCCESS", nowStr),
                new AdminRecentActionRecord("AI_API_PING", "gemini_provider", "SUCCESS", nowStr),
                new AdminRecentActionRecord("DB_MIGRATION_CHECK", "flyway", "SUCCESS", nowStr)
        );

        log.debug("Global admin aggregation complete. Users: {}, Repos: {}, Reviews: {}", 
                totalUsers, totalRepositories, totalReviews);

        return new AdminDashboardSummaryRecord(
                totalUsers,
                totalRepositories,
                totalReviews,
                activeSessions,
                databaseHealthStatus,
                recentActions
        );
    }
}
