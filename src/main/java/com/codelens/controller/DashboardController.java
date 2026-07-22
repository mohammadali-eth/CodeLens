package com.codelens.controller;

import com.codelens.dto.DashboardSummaryRecord;
import com.codelens.service.IDashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller managing aggregated dashboard and analytics data endpoints.
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    private final IDashboardService dashboardService;

    public DashboardController(IDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Retrieves aggregated statistics cards and recent reviews for the logged-in user's dashboard.
     *
     * @param userDetails Authenticated user details
     * @return ResponseEntity containing DashboardSummaryRecord
     */
    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardSummaryRecord> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST Request to get dashboard summary for user: {}", userDetails.getUsername());
        DashboardSummaryRecord summary = dashboardService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(summary);
    }
}
