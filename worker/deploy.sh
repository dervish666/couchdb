#!/bin/bash
# Simple deployment script for CouchDB Worker

echo "Deploying CouchDB Worker to Cloudflare..."

# Navigate to the worker directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Deploy the worker
echo "Deploying with Wrangler..."
npx wrangler deploy

echo "Deployment complete!"