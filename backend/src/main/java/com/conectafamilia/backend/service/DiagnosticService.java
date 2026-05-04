package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.document.DiagnosticResult;
import com.conectafamilia.backend.model.dto.DiagnosticSubmissionDTO;
import com.conectafamilia.backend.model.dto.QuestionResponseDTO;
import com.conectafamilia.backend.repository.mongo.DiagnosticResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiagnosticService {

    @Autowired
    private DiagnosticResultRepository repository;

    public DiagnosticResult processDiagnostic(DiagnosticSubmissionDTO submission) {
        int totalScore = submission.getResponses().stream()
                .mapToInt(QuestionResponseDTO::getScore)
                .sum();

        String profile = determineProfile(totalScore);

        DiagnosticResult result = DiagnosticResult.builder()
                .userId(submission.getUserId())
                .timestamp(LocalDateTime.now())
                .responses(submission.getResponses())
                .totalScore(totalScore)
                .profile(profile)
                .recommendationsSeen(List.of()) // Default empty list
                .build();

        return repository.save(result);
    }

    private String determineProfile(int totalScore) {
        if (totalScore <= 40) return "Riesgo Alto";
        if (totalScore <= 70) return "Moderado";
        return "Fortalecido";
    }

    public List<DiagnosticResult> getHistory() {
        return repository.findAll();
    }
}
