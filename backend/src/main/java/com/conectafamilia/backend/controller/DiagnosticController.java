package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.document.DiagnosticResult;
import com.conectafamilia.backend.model.dto.DiagnosticSubmissionDTO;
import com.conectafamilia.backend.service.DiagnosticService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private DiagnosticService diagnosticService;

    @PostMapping("/submit")
    public ResponseEntity<DiagnosticResult> submitDiagnostic(@Valid @RequestBody DiagnosticSubmissionDTO submission) {
        DiagnosticResult result = diagnosticService.processDiagnostic(submission);
        return ResponseEntity.ok(result);
    }
}
