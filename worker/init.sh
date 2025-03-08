#!/bin/bash
# Initialization script for CouchDB Worker

echo "Initializing CouchDB Worker..."

# Navigate to the worker directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Ask for CouchDB URL
read -p "Enter your CouchDB URL (e.g., http://localhost:5984): " couchdb_url

# Update wrangler.toml with the CouchDB URL
if [ -n "$couchdb_url" ]; then
  # Use sed to replace the COUCHDB_URL line in wrangler.toml
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires a different sed syntax
    sed -i '' "s|COUCHDB_URL = \"https://example.com:5984\"|COUCHDB_URL = \"$couchdb_url\"|" wrangler.toml
  else
    # Linux and other Unix-like systems
    sed -i "s|COUCHDB_URL = \"https://example.com:5984\"|COUCHDB_URL = \"$couchdb_url\"|" wrangler.toml
  fi
  echo "Updated wrangler.toml with CouchDB URL: $couchdb_url"
fi

echo "Initialization complete!"
echo "You can now run './test.sh' to test the worker locally or './deploy.sh' to deploy it to Cloudflare."