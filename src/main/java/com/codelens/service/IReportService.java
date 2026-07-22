package com.codelens.service;

import com.codelens.dto.GenerateReportRequestRecord;
import com.codelens.dto.ReportDetailsResponseRecord;
import com.codelens.dto.ReportResponseRecord;

import java.util.List;

public interface IReportService {
    ReportResponseRecord generateReport(String username, GenerateReportRequestRecord request);
    ReportDetailsResponseRecord getReportById(Long reportId, String username);
    List<ReportResponseRecord> getUserReports(String username);
}
