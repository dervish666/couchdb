#!/bin/bash
# Simple test script for CouchDB Worker

echo "Testing CouchDB Worker locally..."

# Navigate to the worker directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the worker locally
echo "Starting local development server..."
npx wrangler dev --local

# Note: The script will keep running until you press Ctrl+C