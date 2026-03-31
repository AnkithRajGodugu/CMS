-- V35: Assign orphaned shipments to the demo logistics user

UPDATE shipments
SET user_id = (SELECT id FROM users WHERE username = 'driver_raj' LIMIT 1)
WHERE user_id IS NULL;
