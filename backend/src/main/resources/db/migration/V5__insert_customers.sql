INSERT INTO customers (
    first_name,
    last_name,
    email,
    phone,
    sector_id,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT 'John','Doe','john@example.com','9999999991', s.id,1,1,NOW(),NOW()
FROM sectors s WHERE s.code='BANKING'

UNION ALL

SELECT 'Alice','Smith','alice@example.com','9999999992', s.id,1,1,NOW(),NOW()
FROM sectors s WHERE s.code='HEALTHCARE'

UNION ALL

SELECT 'Bob','Johnson','bob@example.com','9999999993', s.id,1,1,NOW(),NOW()
FROM sectors s WHERE s.code='LOGISTICS'

UNION ALL

SELECT 'Rahul','Sharma','rahul@example.com','9999999994', s.id,1,1,NOW(),NOW()
FROM sectors s WHERE s.code='CONTENT'

UNION ALL

SELECT 'Ankith','Raj','ankith@example.com','9999999995', s.id,1,1,NOW(),NOW()
FROM sectors s WHERE s.code='BANKING';