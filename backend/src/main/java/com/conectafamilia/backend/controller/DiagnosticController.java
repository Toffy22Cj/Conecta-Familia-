package com.conectafamilia.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
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
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.service.DiagnosticService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/diagnostico")
public class DiagnosticController {

    @Autowired
    private DiagnosticService diagnosticService;

    @PostMapping("/results")
    public ResponseEntity<DiagnosticResult> saveResult(@RequestBody Map<String, Object> body, Authentication authentication) {
        DiagnosticSubmissionDTO submission = new DiagnosticSubmissionDTO();
        User user = getAuthenticatedUser(authentication);
        submission.setUserId(user.getId());

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

        if (responses.size() != 10 || responses.stream().anyMatch(this::isInvalidResponse)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe enviar exactamente 10 respuestas completas");
        }

        DiagnosticResult result = diagnosticService.processDiagnostic(submission);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<DiagnosticResult>> getHistory(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.ESPECIALISTA) {
            return ResponseEntity.ok(diagnosticService.getHistory());
        }
        return ResponseEntity.ok(diagnosticService.getHistoryForUser(user.getId()));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }

    private boolean isInvalidResponse(QuestionResponseDTO response) {
        return response.getQuestionId() == null
                || response.getQuestionId() < 1
                || response.getQuestionId() > 10
                || response.getScore() == null
                || response.getScore() < 0
                || response.getScore() > 10;
    }
}
