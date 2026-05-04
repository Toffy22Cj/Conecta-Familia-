package com.conectafamilia.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conectafamilia.backend.model.entity.DiagnosticResult;
import com.conectafamilia.backend.model.dto.DiagnosticSubmissionDTO;
import com.conectafamilia.backend.model.dto.QuestionResponseDTO;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.service.DiagnosticService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/diagnostico")
public class DiagnosticController {

    @Autowired
    private DiagnosticService diagnosticService;

    @PostMapping("/results")
    public ResponseEntity<DiagnosticResult> saveResult(@RequestBody Map<String, Object> body, Authentication authentication) {
        System.out.println("Solicitud de guardado de diagnóstico. Autenticado: " + (authentication != null));
        if (authentication != null) {
            System.out.println("Principal: " + authentication.getName());
        }

        DiagnosticSubmissionDTO submission = new DiagnosticSubmissionDTO();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            submission.setUserId(((User) authentication.getPrincipal()).getId());
        } else {
            submission.setUserId(1L);
        }

        Object answersObject = body.get("answers");
        List<QuestionResponseDTO> responses = new ArrayList<>();
        if (answersObject instanceof List<?> answerList) {
            responses = answerList.stream()
                    .filter(item -> item instanceof Map<?, ?>)
                    .map(item -> {
                        Map<?, ?> entry = (Map<?, ?>) item;
                        QuestionResponseDTO dto = new QuestionResponseDTO();
                        Object questionIdValue = entry.get("questionId");
                        if (questionIdValue instanceof Number questionIdNumber) {
                            dto.setQuestionId(questionIdNumber.intValue());
                        }
                        Object scoreValue = entry.get("score");
                        if (scoreValue instanceof Number scoreNumber) {
                            dto.setScore(scoreNumber.intValue());
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());
        }
        submission.setResponses(responses);

        DiagnosticResult result = diagnosticService.processDiagnostic(submission);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<DiagnosticResult>> getHistory(org.springframework.security.core.Authentication authentication) {
        System.out.println("Solicitud de historial de diagnóstico. Autenticado: " + (authentication != null));
        return ResponseEntity.ok(diagnosticService.getHistory());
    }
}
