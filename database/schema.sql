-- ============================================================
-- LEARNOVA - Intelligent Course & Resource Recommendation System
-- MySQL 8.0+ Schema
-- ============================================================

DROP DATABASE IF EXISTS learnova;
CREATE DATABASE learnova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE learnova;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('learner','admin') NOT NULL DEFAULT 'learner',
    is_active   TINYINT(1) NOT NULL DEFAULT 1,
    login_attempts INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    skills          JSON NOT NULL DEFAULT (JSON_ARRAY()),
    goals           JSON NOT NULL DEFAULT (JSON_ARRAY()),
    difficulty      ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
    completed_at    DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_profiles_user UNIQUE (user_id),
    INDEX idx_profiles_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- RESOURCES TABLE
-- ============================================================
CREATE TABLE resources (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(100) NOT NULL,
    tags            JSON NOT NULL DEFAULT (JSON_ARRAY()),
    difficulty      ENUM('Beginner','Intermediate','Advanced') NOT NULL,
    prerequisites   JSON NOT NULL DEFAULT (JSON_ARRAY()),
    url             VARCHAR(512) NULL,
    average_rating  DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    rating_count    INT UNSIGNED NOT NULL DEFAULT 0,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_resources_category (category),
    INDEX idx_resources_difficulty (difficulty),
    INDEX idx_resources_active (is_active),
    INDEX idx_resources_avg_rating (average_rating),
    FULLTEXT INDEX ft_resources_title_desc (title, description)
) ENGINE=InnoDB;

-- ============================================================
-- RECOMMENDATIONS TABLE
-- ============================================================
CREATE TABLE recommendations (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    algorithm_version VARCHAR(50) NOT NULL DEFAULT 'TagOverlapStrategy-v1',
    is_personalized TINYINT(1) NOT NULL DEFAULT 1,
    generated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rec_user (user_id),
    INDEX idx_rec_generated (generated_at)
) ENGINE=InnoDB;

-- ============================================================
-- RECOMMENDATION ITEMS TABLE
-- ============================================================
CREATE TABLE recommendation_items (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recommendation_id   INT UNSIGNED NOT NULL,
    resource_id         INT UNSIGNED NOT NULL,
    `rank`              TINYINT UNSIGNED NOT NULL,
    score               DECIMAL(6,4) NOT NULL DEFAULT 0.0000,
    match_reason        TEXT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_items_rec FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_items_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT uq_rec_item UNIQUE (recommendation_id, `rank`),
    INDEX idx_rec_items_rec (recommendation_id),
    INDEX idx_rec_items_resource (resource_id)
) ENGINE=InnoDB;

-- ============================================================
-- RATINGS TABLE
-- ============================================================
CREATE TABLE ratings (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id                 INT UNSIGNED NOT NULL,
    resource_id             INT UNSIGNED NOT NULL,
    recommendation_item_id  INT UNSIGNED NOT NULL,
    rating                  TINYINT UNSIGNED NOT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_rec_item FOREIGN KEY (recommendation_item_id) REFERENCES recommendation_items(id) ON DELETE CASCADE,
    CONSTRAINT uq_rating UNIQUE (recommendation_item_id),
    CONSTRAINT chk_rating_value CHECK (rating BETWEEN 1 AND 5),
    INDEX idx_ratings_user (user_id),
    INDEX idx_ratings_resource (resource_id)
) ENGINE=InnoDB;
