package com.codelens.service;

import com.codelens.dto.DashboardSummaryRecord;

public interface IDashboardService {
    DashboardSummaryRecord getDashboardSummary(String username);
}
