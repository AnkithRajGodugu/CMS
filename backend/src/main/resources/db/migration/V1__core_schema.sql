CREATE TABLE sectors (
                         id BIGSERIAL PRIMARY KEY,
                         code VARCHAR(255) UNIQUE NOT NULL,
                         name VARCHAR(255) NOT NULL,
                         description VARCHAR(1000),
                         icon VARCHAR(255),
                         route_path VARCHAR(255) NOT NULL,
                         configuration JSON,
                         enabled BOOLEAN NOT NULL DEFAULT TRUE,
                         display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_sectors_code ON sectors(code);
CREATE INDEX idx_sectors_enabled ON sectors(enabled);
CREATE INDEX idx_sectors_display_order ON sectors(display_order);



CREATE TABLE organizations (
                               id BIGSERIAL PRIMARY KEY,
                               name VARCHAR(255) NOT NULL,
                               domain VARCHAR(255),
                               sector_id BIGINT NOT NULL,
                               settings JSONB,
                               active BOOLEAN NOT NULL DEFAULT TRUE,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_org_sector FOREIGN KEY (sector_id) REFERENCES sectors(id)
);

CREATE INDEX idx_organizations_sector_id ON organizations(sector_id);
CREATE INDEX idx_organizations_active ON organizations(active);
CREATE INDEX idx_organizations_domain ON organizations(domain);



CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       email VARCHAR(1000) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       user_type VARCHAR(50) NOT NULL,
                       sector_id BIGINT,
                       organization_id BIGINT,
                       enabled BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       last_login TIMESTAMP,
                       CONSTRAINT fk_user_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
                       CONSTRAINT fk_user_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_users_sector_id ON users(sector_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_enabled ON users(enabled);
CREATE INDEX idx_users_sector_org ON users(sector_id, organization_id);



CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL,
                            role_name VARCHAR(255),
                            CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id)
);



CREATE TABLE customers (
                           id BIGSERIAL PRIMARY KEY,
                           first_name VARCHAR(255) NOT NULL,
                           last_name VARCHAR(255) NOT NULL,
                           email VARCHAR(255),
                           phone VARCHAR(255),
                           sector_id BIGINT NOT NULL,
                           created_by BIGINT,
                           updated_by BIGINT,
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_customer_sector FOREIGN KEY (sector_id) REFERENCES sectors(id)
);

CREATE INDEX idx_customers_sector_id ON customers(sector_id);
CREATE INDEX idx_customers_created_at ON customers(created_at);