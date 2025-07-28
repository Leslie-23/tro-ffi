-- filepath: ride-hailing-backend/src/db/db.sql
-- Database: ride_hailing_app
-- Purpose: Ride hailing system with car and bus pooling functionality
-- Create database if not exists `ride_hailing_backend`
CREATE DATABASE IF NOT EXISTS `ride_hailing_backend`;
USE `ride_hailing_backend`;
-- Users Table: Stores user accounts and authentication information
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(255),
    email VARCHAR(100),
    password VARCHAR(512),
    username VARCHAR(100) UNIQUE NOT NULL,
    profile_image TEXT,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    ride_count INT DEFAULT 0,
    is_driver TINYINT(1) DEFAULT 0,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(20),
    google_id VARCHAR(256)
);
-- Locations Table: Physical locations/stops in the transportation network
CREATE TABLE locations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    is_popular TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Buses Table: Vehicle inventory and status tracking
CREATE TABLE buses (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    driver_id VARCHAR(36),
    operator_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    last_maintenance DATE,
    next_maintenance DATE,
    fuel_level DECIMAL(3, 2) DEFAULT 0.00,
    current_latitude DECIMAL(10, 6),
    current_longitude DECIMAL(10, 6),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operators(id)
);
-- Cars Table: Vehicle inventory for carpooling
CREATE TABLE cars (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    driver_id VARCHAR(36),
    operator_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operators(id)
);
-- Routes Table: Defined transportation routes between locations
CREATE TABLE routes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_location_id VARCHAR(36) NOT NULL,
    end_location_id VARCHAR(36) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,
    estimated_duration INT NOT NULL,
    base_fare DECIMAL(10, 2) NOT NULL,
    per_km_fare DECIMAL(10, 2) NOT NULL,
    current_fare DECIMAL(10, 2) NOT NULL,
    frequency_minutes INT NOT NULL,
    first_departure TIME NOT NULL,
    last_departure TIME NOT NULL,
    popularity DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (start_location_id) REFERENCES locations(id),
    FOREIGN KEY (end_location_id) REFERENCES locations(id)
);
-- Bookings Table: User reservation and trip records
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    route_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    vehicle_type ENUM('bus', 'car') NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    pickup_location_id VARCHAR(36) NOT NULL,
    dropoff_location_id VARCHAR(36) NOT NULL,
    pickup_time DATETIME NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_method ENUM('mobile_money', 'card', 'cash') NOT NULL,
    passenger_count INT DEFAULT 1,
    is_group_booking TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (vehicle_id) REFERENCES buses(id)
    OR REFERENCES cars(id),
    FOREIGN KEY (pickup_location_id) REFERENCES locations(id),
    FOREIGN KEY (dropoff_location_id) REFERENCES locations(id)
);
-- Additional Supporting Tables --
CREATE TABLE operators (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(512) NOT NULL,
    fleet_size INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    commission DECIMAL(5, 2) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE drivers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    license_number VARCHAR(20) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    experience INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    total_trips INT DEFAULT 0,
    status ENUM('available', 'on_trip', 'offline') DEFAULT 'available',
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE carpool_requests (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    start_location_id VARCHAR(36) NOT NULL,
    end_location_id VARCHAR(36) NOT NULL,
    pickup_time DATETIME NOT NULL,
    passenger_count INT DEFAULT 1,
    status ENUM('pending', 'matched', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (start_location_id) REFERENCES locations(id),
    FOREIGN KEY (end_location_id) REFERENCES locations(id)
);
CREATE TABLE ride_matches (
    id VARCHAR(36) PRIMARY KEY,
    carpool_request_id VARCHAR(36) NOT NULL,
    driver_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carpool_request_id) REFERENCES carpool_requests(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES buses(id)
    OR REFERENCES cars(id)
);
-- Indexes for Performance Optimization
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_routes_popularity ON routes(popularity);
CREATE INDEX idx_carpool_requests_user ON carpool_requests(user_id);
CREATE INDEX idx_ride_matches_request ON ride_matches(carpool_request_id);