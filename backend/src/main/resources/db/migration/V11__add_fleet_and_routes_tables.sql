CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    capacity DOUBLE PRECISION,
    current_driver VARCHAR(100),
    last_service_date TIMESTAMP
);

CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km DOUBLE PRECISION,
    estimated_time_minutes INTEGER,
    status VARCHAR(50) NOT NULL
);
