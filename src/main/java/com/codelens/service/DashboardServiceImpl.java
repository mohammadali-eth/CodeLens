package com.codelens.service;

import com.codelens.dto.DashboardSummaryRecord;
import com.codelens.dto.RecentReviewActivityRecord;
import com.codelens.model.CodeReview;
import com.codelens.repository.CodeRepositoryRepository;
import com.codelens.repository.CodeReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Enterprise Service Implementation executing aggregated DB queries for Dashboard metrics.
 */
@Service
public class DashboardServiceImpl implements IDashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final CodeRepositoryRepository repositoryRepository;
    private final CodeReviewRepository reviewRepository;

    public DashboardServiceImpl(CodeRepositoryRepository repositoryRepository, CodeReviewRepository reviewRepository) {
        this.repositoryRepository = repositoryRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryRecord getDashboardSummary(String username) {
        log.info("Generating dashboard statistics summary for user: {}", username);

        long totalRepositories = repositoryRepository.countByOwnerUsername(username);
        long totalReviews = reviewRepository.countByReviewerUsername(username);
        long totalIssuesFound = reviewRepository.countIssuesByReviewerUsername(username);
        double averageQualityScore = reviewRepository.averageScoreByReviewerUsername(username);

        List<CodeReview> recentReviews = reviewRepository.findTop5ByReviewerUsernameOrderByCreatedAtDesc(username);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        List<RecentReviewActivityRecord> recentActivities = recentReviews.stream()
                .map(cr -> new RecentReviewActivityRecord(
                        cr.getId(),
                        cr.getRepository().getName(),
                        cr.getRepository().getProgrammingLanguage(),
                        cr.getOverallScore(),
                        cr.getStatus(),
                        cr.getCreatedAt().format(formatter)
                ))
                .toList();

        log.debug("Dashboard aggregation complete for user: {}. Repos: {}, Reviews: {}, Issues: {}, AvgScore: {}",
                username, totalRepositories, totalReviews, totalIssuesFound, averageQualityScore);

        return new DashboardSummaryRecord(
                totalRepositories,
                totalReviews,
                totalIssuesFound,
                Math.round(averageQualityScore * 10.0) / 10.0, // round to 1 decimal place
                recentActivities
        );
    }
}
