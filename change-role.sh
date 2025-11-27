#!/bin/bash
# Quick script to change a user's role

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./change-role.sh user@example.com ROLE"
    echo ""
    echo "Available roles:"
    echo "  - attendee"
    echo "  - organiser"
    echo "  - vendor"
    echo "  - admin"
    echo ""
    echo "Example: ./change-role.sh john@example.com organiser"
    exit 1
fi

EMAIL="$1"
ROLE="$2"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Changing user role..."
echo "Email: $EMAIL"
echo "New Role: $ROLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PGPASSWORD=admin123 psql -U enock -d eventKonnect << SQL
-- Update user role
UPDATE "User" 
SET "roleId" = (SELECT id FROM "Role" WHERE name = '$ROLE')
WHERE email = '$EMAIL';

-- Show updated user info
SELECT u.username, u.email, r.name as role, u."isVerified"
FROM "User" u 
LEFT JOIN "Role" r ON u."roleId" = r.id 
WHERE u.email = '$EMAIL';
SQL

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Role changed!"
echo ""
echo "⚠️  IMPORTANT: User must logout and login again!"
echo "   The JWT token needs to be refreshed."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
