package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.dto.ChallengeResponse;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.entity.UserChallengeStatus;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/retos")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<ChallengeResponse>> getAllChallenges(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(challengeService.getChallengesForUser(user.getId()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<UserChallengeStatus> toggleChallenge(
            @PathVariable String id,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(challengeService.markAsCompleted(user.getId(), id));
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<List<UserChallengeStatus>> getUserProgress(
            @PathVariable Long userId,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (!user.getId().equals(userId) && user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puede consultar progreso de otro usuario");
        }
        return ResponseEntity.ok(challengeService.getUserProgress(userId));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<UserChallengeStatus>> getOwnProgress(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(challengeService.getUserProgress(user.getId()));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }
}
