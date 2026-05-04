package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, String> {
}
