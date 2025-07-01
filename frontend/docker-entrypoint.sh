#!/bin/sh
set -e

# Replace placeholders in env.js with real environment variables at runtime
sed -i "s|__VITE_BACKEND_URL__|${VITE_BACKEND_URL}|g" /usr/share/nginx/html/env.js
sed -i "s|__VITE_API_KEY__|${VITE_API_KEY}|g" /usr/share/nginx/html/env.js
sed -i "s|__VITE_IMMICH_PUBLIC_URL__|${VITE_IMMICH_PUBLIC_URL}|g" /usr/share/nginx/html/env.js

# Start nginx
exec "$@"



