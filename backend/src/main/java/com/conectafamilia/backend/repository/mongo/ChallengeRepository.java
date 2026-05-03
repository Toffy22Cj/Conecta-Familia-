package com.conectafamilia.backend.repository.mongo;

import com.conectafamilia.backend.model.document.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends MongoRepository<Challenge, String> {
}
