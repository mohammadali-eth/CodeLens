package com.codelens.controller;

import com.codelens.dto.AdminDashboardSummaryRecord;
import com.codelens.service.IAdminDashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller managing system administration and global monitoring telemetry.
 */
@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private static final Logger log = LoggerFactory.getLogger(AdminDashboardController.class);

    private final IAdminDashboardService adminDashboardService;

    public AdminDashboardController(IAdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    /**
     * Retrieves global stats, system health statuses, and administrative action histories.
     * Accessible only by users holding the ROLE_ADMIN authorization.
     *
     * @return ResponseEntity containing AdminDashboardSummaryRecord
     */
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardSummaryRecord> getAdminDashboardSummary() {
        log.info("REST Request to get global admin dashboard summary metrics");
        AdminDashboardSummaryRecord summary = adminDashboardService.getAdminDashboardSummary();
        return ResponseEntity.ok(summary);
    }
}
