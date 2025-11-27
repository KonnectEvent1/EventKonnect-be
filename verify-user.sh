#!/bin/bash
# Quick script to verify a user by email

if [ -z "$1" ]; then
    echo "Usage: ./verify-user.sh user@example.com"
    exit 1
fi

EMAIL="$1"

echo "Verifying user: $EMAIL"

PGPASSWORD=admin123 psql -U enock -d eventKonnect -c \
  "UPDATE \"User\" SET \"isVerified\" = true WHERE email = '$EMAIL'; \
   SELECT username, email, \"isVerified\" FROM \"User\" WHERE email = '$EMAIL';"

echo "✅ User verified!"
