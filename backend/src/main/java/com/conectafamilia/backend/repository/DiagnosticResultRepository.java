package com.conectafamilia.backend.repository;

import com.conectafamilia.backend.model.document.DiagnosticResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticResultRepository extends MongoRepository<DiagnosticResult, String> {
    List<DiagnosticResult> findByUserId(Long userId);
}
