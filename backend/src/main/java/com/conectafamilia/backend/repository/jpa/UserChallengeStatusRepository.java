package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.UserChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserChallengeStatusRepository extends JpaRepository<UserChallengeStatus, Long> {
    List<UserChallengeStatus> findByUserId(Long userId);
    Optional<UserChallengeStatus> findByUserIdAndChallengeId(Long userId, String challengeId);
}
