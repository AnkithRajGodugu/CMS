-- V24: Add persistent notification table
CREATE TABLE IF NOT EXISTS notification (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
    title       VARCHAR(255)  NOT NULL,
    message     TEXT,
    read        BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    link        VARCHAR(512)
);

CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notification(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notification(created_at DESC);
