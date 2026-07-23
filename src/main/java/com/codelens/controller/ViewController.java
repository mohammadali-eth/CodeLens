package com.codelens.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Spring MVC controller routing URLs to Thymeleaf templates.
 */
@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "redirect:/dashboard";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard/index";
    }

    @GetMapping("/repositories")
    public String repositories() {
        return "repository/list";
    }

    @GetMapping("/repositories/details")
    public String repositoryDetails() {
        return "repository/details";
    }

    @GetMapping("/repositories/upload")
    public String uploadFiles() {
        return "repository/upload";
    }

    @GetMapping("/reviews")
    public String reviewHistory() {
        return "review/history";
    }

    @GetMapping("/reviews/result")
    public String reviewResult() {
        return "review/result";
    }

    @GetMapping("/reports")
    public String reports() {
        return "reports/list";
    }

    @GetMapping("/analytics")
    public String analytics() {
        return "analytics/index";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile/index";
    }

    @GetMapping("/settings")
    public String settings() {
        return "profile/settings";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin/index";
    }

    @GetMapping("/blockchain")
    public String blockchain() {
        return "blockchain/index";
    }
}
