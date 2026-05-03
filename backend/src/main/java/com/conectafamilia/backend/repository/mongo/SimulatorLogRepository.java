package com.conectafamilia.backend.repository.mongo;

import com.conectafamilia.backend.model.document.SimulatorLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulatorLogRepository extends MongoRepository<SimulatorLog, String> {
    List<SimulatorLog> findByUserId(Long userId);
}
