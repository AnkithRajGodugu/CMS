-- Migration script for enabling Row-Level Security (RLS) policies
-- This script implements multi-tenant data isolation at the database level

-- Step 1: Enable Row-Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 2: Create policy for user data isolation
-- Users can only access their own data, unless they have ADMIN role
CREATE POLICY user_isolation_policy ON users
    USING (
        -- Allow access if:
        -- 1. The row belongs to the current user
        id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
        OR
        -- 2. The current user has ADMIN role
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
            AND ur.role_name = 'ADMIN'
        )
    );

-- Step 3: Enable RLS on organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for organization data isolation
-- Users can only access organizations they belong to, or all if they're ADMIN
CREATE POLICY organization_isolation_policy ON organizations
    USING (
        -- Allow access if:
        -- 1. The user belongs to this organization
        id IN (
            SELECT organization_id FROM users
            WHERE id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
        )
        OR
        -- 2. The current user has ADMIN role
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
            AND ur.role_name = 'ADMIN'
        )
    );

-- Step 5: Enable RLS on audit_log table
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policy for audit log access
-- Users can only see their own audit logs, unless they're ADMIN
CREATE POLICY audit_log_isolation_policy ON audit_log
    USING (
        -- Allow access if:
        -- 1. The audit log belongs to the current user
        user_id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
        OR
        -- 2. The current user has ADMIN role
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
            AND ur.role_name = 'ADMIN'
        )
        OR
        -- 3. The user is from the same organization (for organization admins)
        (
            organization_id IS NOT NULL
            AND organization_id IN (
                SELECT organization_id FROM users
                WHERE id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
            )
            AND EXISTS (
                SELECT 1 FROM user_roles ur
                WHERE ur.user_id = NULLIF(current_setting('app.current_user_id', true), '')::BIGINT
                AND ur.role_name = 'ORG_ADMIN'
            )
        )
    );

-- Step 7: Create helper function to set session context
-- This function will be called by the application to set the current user context
CREATE OR REPLACE FUNCTION set_user_context(p_user_id BIGINT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', p_user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create helper function to clear session context
CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', '', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Grant necessary permissions
-- Note: In production, you should use specific database users with limited permissions
-- For development, we'll grant to the application user

-- Comments for documentation
COMMENT ON POLICY user_isolation_policy ON users IS 
    'Ensures users can only access their own data unless they have ADMIN role';

COMMENT ON POLICY organization_isolation_policy ON organizations IS 
    'Ensures users can only access organizations they belong to unless they have ADMIN role';

COMMENT ON POLICY audit_log_isolation_policy ON audit_log IS 
    'Ensures users can only see their own audit logs, or organization logs if they are ORG_ADMIN';

COMMENT ON FUNCTION set_user_context(BIGINT) IS 
    'Sets the current user context for row-level security policies';

COMMENT ON FUNCTION clear_user_context() IS 
    'Clears the current user context';
