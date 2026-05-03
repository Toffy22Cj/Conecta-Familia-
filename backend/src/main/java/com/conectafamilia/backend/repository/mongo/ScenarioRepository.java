package com.conectafamilia.backend.repository.mongo;

import com.conectafamilia.backend.model.document.Scenario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScenarioRepository extends MongoRepository<Scenario, String> {
}
