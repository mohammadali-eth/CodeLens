package com.codelens.repository;

import com.codelens.model.CodeReviewIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface CodeReviewIssueRepository extends JpaRepository<CodeReviewIssue, Long> {

    @Query("SELECT cri.category, COUNT(cri) FROM CodeReviewIssue cri WHERE cri.codeReview.reviewer.username = :username GROUP BY cri.category")
    Map<String, Long> countIssuesByCategoryForUser(@Param("username") String username);
}
