-- V7: Remove redundant user_roles @ElementCollection table.
-- Authority is derived solely from the `role` column in `users`.
-- This table was never populated in production flows.

DROP TABLE IF EXISTS user_roles;
