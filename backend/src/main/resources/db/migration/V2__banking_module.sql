CREATE TABLE bank_accounts (
                               id BIGSERIAL PRIMARY KEY,
                               account_number VARCHAR(255) UNIQUE NOT NULL,
                               account_type VARCHAR(50) NOT NULL,
                               balance NUMERIC(15,2) NOT NULL DEFAULT 0,
                               customer_name VARCHAR(255) NOT NULL,
                               status VARCHAR(50),
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bank_accounts_account_number ON bank_accounts(account_number);
CREATE INDEX idx_bank_accounts_customer_name ON bank_accounts(customer_name);
CREATE INDEX idx_bank_accounts_status ON bank_accounts(status);
CREATE INDEX idx_bank_accounts_created_at ON bank_accounts(created_at);



CREATE TABLE transactions (
                              id BIGSERIAL PRIMARY KEY,
                              transaction_id VARCHAR(255) UNIQUE NOT NULL,
                              type VARCHAR(50) NOT NULL,
                              amount NUMERIC(15,2) NOT NULL,
                              account_number VARCHAR(255) NOT NULL,
                              status VARCHAR(50),
                              description VARCHAR(1000),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              processed_at TIMESTAMP
);

CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_account_number ON transactions(account_number);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_processed_at ON transactions(processed_at);
CREATE INDEX idx_transactions_account_status_date ON transactions(account_number, status, created_at);