package com.codelens.repository;

import com.codelens.model.CodeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeReviewRepository extends JpaRepository<CodeReview, Long> {

    @Query("SELECT COUNT(cr) FROM CodeReview cr WHERE cr.reviewer.username = :username")
    long countByReviewerUsername(@Param("username") String username);

    @Query("SELECT COALESCE(AVG(cr.overallScore), 0.0) FROM CodeReview cr WHERE cr.reviewer.username = :username AND cr.status = 'COMPLETED'")
    double averageScoreByReviewerUsername(@Param("username") String username);

    @Query("SELECT COALESCE(SUM(cr.criticalIssuesCount + cr.warningIssuesCount), 0) FROM CodeReview cr WHERE cr.reviewer.username = :username")
    long countIssuesByReviewerUsername(@Param("username") String username);

    @Query("SELECT cr FROM CodeReview cr JOIN FETCH cr.repository WHERE cr.reviewer.username = :username ORDER BY cr.createdAt DESC")
    List<CodeReview> findTop5ByReviewerUsernameOrderByCreatedAtDesc(@Param("username") String username);
}
