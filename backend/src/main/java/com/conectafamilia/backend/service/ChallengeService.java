package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.dto.ChallengeResponse;
import com.conectafamilia.backend.model.entity.Challenge;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.entity.UserChallengeStatus;
import com.conectafamilia.backend.repository.jpa.ChallengeRepository;
import com.conectafamilia.backend.repository.jpa.UserChallengeStatusRepository;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private UserChallengeStatusRepository statusRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public List<ChallengeResponse> getChallengesForUser(Long userId) {
        Set<String> completedChallengeIds = statusRepository.findByUserId(userId).stream()
                .filter(status -> Boolean.TRUE.equals(status.getCompleted()))
                .map(UserChallengeStatus::getChallengeId)
                .collect(Collectors.toSet());

        return challengeRepository.findAll().stream()
                .map(challenge -> ChallengeResponse.from(
                        challenge,
                        completedChallengeIds.contains(challenge.getId())))
                .collect(Collectors.toList());
    }

    public UserChallengeStatus markAsCompleted(Long userId, String challengeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserChallengeStatus status = statusRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseGet(() -> UserChallengeStatus.builder()
                        .user(user)
                        .challengeId(challengeId)
                        .completed(false)
                        .build());
        boolean nextCompleted = !Boolean.TRUE.equals(status.getCompleted());
        status.setCompleted(nextCompleted);
        status.setCompletedAt(nextCompleted ? LocalDateTime.now() : null);
                
        return statusRepository.save(status);
    }

    public List<UserChallengeStatus> getUserProgress(Long userId) {
        return statusRepository.findByUserId(userId);
    }
}
