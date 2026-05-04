package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.entity.Challenge;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.entity.UserChallengeStatus;
import com.conectafamilia.backend.repository.jpa.ChallengeRepository;
import com.conectafamilia.backend.repository.jpa.UserChallengeStatusRepository;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public UserChallengeStatus markAsCompleted(Long userId, String challengeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        UserChallengeStatus status = UserChallengeStatus.builder()
                .user(user)
                .challengeId(challengeId)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
                
        return statusRepository.save(status);
    }

    public List<UserChallengeStatus> getUserProgress(Long userId) {
        return statusRepository.findByUserId(userId);
    }
}
