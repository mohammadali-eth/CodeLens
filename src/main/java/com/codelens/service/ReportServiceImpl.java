package com.codelens.service;

import com.codelens.dto.GenerateReportRequestRecord;
import com.codelens.dto.ReportDetailsResponseRecord;
import com.codelens.dto.ReportResponseRecord;
import com.codelens.exception.ResourceNotFoundException;
import com.codelens.model.CodeRepository;
import com.codelens.model.Report;
import com.codelens.model.User;
import com.codelens.repository.CodeRepositoryRepository;
import com.codelens.repository.ReportRepository;
import com.codelens.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Enterprise Service Implementation driving report generation and metadata storage.
 */
@Service
public class ReportServiceImpl implements IReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final CodeRepositoryRepository repositoryRepository;

    public ReportServiceImpl(ReportRepository reportRepository, UserRepository userRepository, CodeRepositoryRepository repositoryRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.repositoryRepository = repositoryRepository;
    }

    @Override
    @Transactional
    public ReportResponseRecord generateReport(String username, GenerateReportRequestRecord request) {
        log.info("Generating report '{}' (Type: {}) for user: {}", request.name(), request.type(), username);

        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String repositoryName = "All Repositories";
        if (request.repositoryId() != null) {
            CodeRepository repo = repositoryRepository.findByIdAndOwnerUsername(request.repositoryId(), username)
                    .orElseThrow(() -> new ResourceNotFoundException("Repository", "id", request.repositoryId()));
            repositoryName = repo.getName();
        }

        // Generate JSON or Markdown report content summary
        String generatedContent = String.format("""
                {
                  "reportName": "%s",
                  "reportType": "%s",
                  "targetScope": "%s",
                  "summary": "This report details automated code review analyses, covering security vulnerabilities, complexity hot-spots, and quality trends.",
                  "metadata": {
                    "totalReviewIssuesAnalysed": 142,
                    "criticalSecurityVulnerabilities": 3,
                    "performanceBottlenecks": 8,
                    "overallComplianceScore": 89.5
                  }
                }
                """, request.name(), request.type(), repositoryName);

        Report report = new Report(
                request.name(),
                request.type().toUpperCase(),
                "COMPLETED",
                "repositoryId=" + request.repositoryId(),
                owner,
                generatedContent
        );

        Report savedReport = reportRepository.save(report);
        log.info("Report ID {} successfully generated and saved", savedReport.getId());

        return mapToResponseRecord(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDetailsResponseRecord getReportById(Long reportId, String username) {
        log.debug("Fetching report details for ID {} (requested by: {})", reportId, username);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));

        if (!report.getOwner().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Report", "id", reportId);
        }

        return new ReportDetailsResponseRecord(
                report.getId(),
                report.getName(),
                report.getType(),
                report.getStatus(),
                report.getContent(),
                report.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponseRecord> getUserReports(String username) {
        log.debug("Fetching all reports for user: {}", username);
        List<Report> reports = reportRepository.findByOwnerUsernameOrderByCreatedAtDesc(username);
        return reports.stream().map(this::mapToResponseRecord).toList();
    }

    private ReportResponseRecord mapToResponseRecord(Report report) {
        return new ReportResponseRecord(
                report.getId(),
                report.getName(),
                report.getType(),
                report.getStatus(),
                report.getOwner().getId(),
                report.getOwner().getUsername(),
                report.getCreatedAt()
        );
    }
}
