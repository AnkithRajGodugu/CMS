CREATE TABLE patients (
                          id BIGSERIAL PRIMARY KEY,
                          patient_id VARCHAR(255) UNIQUE NOT NULL,
                          first_name VARCHAR(255) NOT NULL,
                          last_name VARCHAR(255) NOT NULL,
                          date_of_birth DATE,
                          age INTEGER,
                          condition VARCHAR(255),
                          last_visit DATE,
                          status VARCHAR(50),
                          contact_number VARCHAR(255),
                          email VARCHAR(255),
                          address VARCHAR(255),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE appointments (
                              id BIGSERIAL PRIMARY KEY,
                              appointment_id VARCHAR(255) UNIQUE NOT NULL,
                              patient_name VARCHAR(255) NOT NULL,
                              doctor_name VARCHAR(255) NOT NULL,
                              appointment_time TIMESTAMP NOT NULL,
                              type VARCHAR(50) NOT NULL,
                              status VARCHAR(50),
                              notes VARCHAR(1000),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);