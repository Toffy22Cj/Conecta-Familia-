-- Database Initialization Script for Conecta Familia
-- Database: MariaDB

CREATE DATABASE IF NOT EXISTS conectafamilia_db;
USE conectafamilia_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    client_type VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialist_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    estimated_minutes INT,
    category VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS user_challenge_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_id VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

-- Diagnostic results
CREATE TABLE IF NOT EXISTS diagnostic_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    timestamp DATETIME NOT NULL,
    total_score INT NOT NULL,
    profile VARCHAR(80) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS diagnostic_result_responses (
    diagnostic_result_id BIGINT NOT NULL,
    response_order INT NOT NULL,
    question_id INT,
    score INT,
    PRIMARY KEY (diagnostic_result_id, response_order),
    FOREIGN KEY (diagnostic_result_id) REFERENCES diagnostic_results(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS diagnostic_result_recommendations (
    diagnostic_result_id BIGINT NOT NULL,
    recommendation_order INT NOT NULL,
    recommendation TEXT,
    PRIMARY KEY (diagnostic_result_id, recommendation_order),
    FOREIGN KEY (diagnostic_result_id) REFERENCES diagnostic_results(id) ON DELETE CASCADE
);

-- Forum
CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(100),
    author_name VARCHAR(120),
    category VARCHAR(80),
    created_at DATETIME NOT NULL,
    likes INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS forum_post_tags (
    forum_post_id VARCHAR(100) NOT NULL,
    tag_order INT NOT NULL,
    tag VARCHAR(80),
    PRIMARY KEY (forum_post_id, tag_order),
    FOREIGN KEY (forum_post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_post_comments (
    forum_post_id VARCHAR(100) NOT NULL,
    comment_order INT NOT NULL,
    comment_id VARCHAR(100),
    author_id VARCHAR(100),
    author_name VARCHAR(120),
    content TEXT,
    created_at DATETIME,
    PRIMARY KEY (forum_post_id, comment_order),
    FOREIGN KEY (forum_post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

-- Simulator
CREATE TABLE IF NOT EXISTS scenarios (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenario_options (
    scenario_id VARCHAR(100) NOT NULL,
    option_order INT NOT NULL,
    option_id VARCHAR(20),
    option_text TEXT NOT NULL,
    feedback TEXT,
    is_correct BOOLEAN,
    PRIMARY KEY (scenario_id, option_order),
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS simulator_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    scenario_id VARCHAR(100) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS simulator_log_choices (
    simulator_log_id BIGINT NOT NULL,
    choice_order INT NOT NULL,
    step_number INT,
    choice_text TEXT,
    is_correct BOOLEAN,
    PRIMARY KEY (simulator_log_id, choice_order),
    FOREIGN KEY (simulator_log_id) REFERENCES simulator_logs(id) ON DELETE CASCADE
);
