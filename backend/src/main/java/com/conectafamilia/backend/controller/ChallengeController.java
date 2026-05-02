package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.document.Challenge;
import com.conectafamilia.backend.model.entity.UserChallengeStatus;
import com.conectafamilia.backend.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    @PostMapping("/{challengeId}/complete")
    public ResponseEntity<UserChallengeStatus> completeChallenge(
            @PathVariable String challengeId, 
            @RequestParam Long userId) {
        // Ideally userId comes from JWT principal in a real app
        return ResponseEntity.ok(challengeService.markAsCompleted(userId, challengeId));
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<List<UserChallengeStatus>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(challengeService.getUserProgress(userId));
    }
}
